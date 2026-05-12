package com.mzansirides.service;

import com.mzansirides.dto.RevenueReport;
import com.mzansirides.model.Booking;
import com.mzansirides.repository.BookingRepository;
import com.opencsv.CSVWriter;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.pdf.*;
import java.awt.Color;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.StringWriter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@Service
public class ReportService {

    private static final Logger log = LoggerFactory.getLogger(ReportService.class);
    private final BookingRepository bookingRepository;

    public ReportService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public RevenueReport generateRevenueReport(LocalDate start, LocalDate end) {
        LocalDateTime startDt = start.atStartOfDay();
        LocalDateTime endDt = end.plusDays(1).atStartOfDay();

        List<Booking> all = bookingRepository.findAll().stream()
                .filter(b -> b.getCreatedAt() != null
                        && !b.getCreatedAt().isBefore(startDt)
                        && b.getCreatedAt().isBefore(endDt))
                .sorted(Comparator.comparing(Booking::getCreatedAt).reversed())
                .toList();

        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        List<RevenueReport.BookingItem> items = all.stream()
                .map(b -> new RevenueReport.BookingItem(
                        b.getId(),
                        b.getCustomerName(),
                        b.getCarName(),
                        b.getCity(),
                        b.getStatus(),
                        b.getPaymentStatus(),
                        b.getCheckoutDate() != null ? b.getCheckoutDate().toString() : "-",
                        b.getCreatedAt() != null ? b.getCreatedAt().format(df) : "-",
                        b.getPaymentAmount() != null ? b.getPaymentAmount() : 0
                ))
                .toList();

        long paidRevenue = all.stream()
                .filter(b -> "PAID".equals(b.getPaymentStatus()))
                .mapToLong(b -> b.getPaymentAmount() != null ? b.getPaymentAmount() : 0)
                .sum();

        long pendingRevenue = all.stream()
                .filter(b -> !"PAID".equals(b.getPaymentStatus()) && b.getPaymentAmount() != null)
                .mapToLong(Booking::getPaymentAmount)
                .sum();

        long totalRevenue = paidRevenue + pendingRevenue;

        RevenueReport.Summary summary = new RevenueReport.Summary(
                all.size(),
                (int) all.stream().filter(b -> "completed".equals(b.getStatus()) || "PAID".equals(b.getPaymentStatus())).count(),
                (int) all.stream().filter(b -> "approved".equals(b.getStatus()) || "pending_approval".equals(b.getStatus())).count(),
                (int) all.stream().filter(b -> "cancelled".equals(b.getStatus()) || "rejected".equals(b.getStatus())).count(),
                totalRevenue,
                paidRevenue,
                pendingRevenue
        );

        return new RevenueReport(
                start.toString(), end.toString(),
                LocalDateTime.now().format(df),
                summary, items
        );
    }

    public byte[] generateCsv(RevenueReport report) {
        try {
            StringWriter sw = new StringWriter();
            CSVWriter csv = new CSVWriter(sw);

            csv.writeNext(new String[]{"MzansiRides - Revenue Report"});
            csv.writeNext(new String[]{"Period: " + report.startDate() + " to " + report.endDate()});
            csv.writeNext(new String[]{"Generated: " + report.generatedAt()});
            csv.writeNext(new String[]{""});
            csv.writeNext(new String[]{"SUMMARY"});
            csv.writeNext(new String[]{"Total Bookings", String.valueOf(report.summary().totalBookings())});
            csv.writeNext(new String[]{"Completed/Paid", String.valueOf(report.summary().completedBookings())});
            csv.writeNext(new String[]{"Pending", String.valueOf(report.summary().pendingBookings())});
            csv.writeNext(new String[]{"Cancelled", String.valueOf(report.summary().cancelledBookings())});
            csv.writeNext(new String[]{"Total Revenue", "R" + report.summary().totalRevenue()});
            csv.writeNext(new String[]{"Paid Revenue", "R" + report.summary().paidRevenue()});
            csv.writeNext(new String[]{"Pending Revenue", "R" + report.summary().pendingRevenue()});
            csv.writeNext(new String[]{""});
            csv.writeNext(new String[]{"BOOKINGS"});
            csv.writeNext(new String[]{"ID","Customer","Car","City","Status","Payment","Checkout Date","Created","Amount"});

            for (var b : report.bookings()) {
                csv.writeNext(new String[]{
                        String.valueOf(b.id()), b.customerName(), b.carName(), b.city(),
                        b.status(), b.paymentStatus(), b.checkoutDate(), b.createdAt(),
                        "R" + b.amount()
                });
            }

            csv.close();
            return sw.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Failed to generate CSV", e);
            throw new RuntimeException("CSV generation failed", e);
        }
    }

    public byte[] generatePdf(RevenueReport report) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(doc, baos);
            doc.open();

            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD, new Color(233, 69, 96));
            Font headerFont = new Font(Font.HELVETICA, 12, Font.BOLD, Color.WHITE);
            Font cellFont = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.DARK_GRAY);
            Font boldFont = new Font(Font.HELVETICA, 11, Font.BOLD);

            try {
                java.net.URL logoUrl = null;
                for (String path : new String[]{
                        "static/assets/logoWhite-48fdaaa9.png",
                        "static/assets/logoWhite.png",
                        "static/logo.png"
                }) {
                    ClassPathResource r = new ClassPathResource(path);
                    if (r.exists()) { logoUrl = r.getURL(); break; }
                }
                if (logoUrl == null) {
                    org.springframework.core.io.Resource[] resources =
                            new org.springframework.core.io.support.PathMatchingResourcePatternResolver()
                                    .getResources("classpath:static/assets/logoWhite*");
                    if (resources.length > 0) logoUrl = resources[0].getURL();
                }
                if (logoUrl != null) {
                    Image logo = Image.getInstance(logoUrl);
                    logo.scaleToFit(120, 40);
                    logo.setAlignment(Image.LEFT);
                    doc.add(logo);
                }
            } catch (Exception e) {
                log.warn("Logo not found for PDF: {}", e.getMessage());
            }

            Paragraph title = new Paragraph("MzansiRides - Revenue Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(8);
            doc.add(title);

            Paragraph period = new Paragraph("Period: " + report.startDate() + " to " + report.endDate()
                    + "    |    Generated: " + report.generatedAt(), cellFont);
            period.setAlignment(Element.ALIGN_CENTER);
            period.setSpacingAfter(12);
            doc.add(period);

            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(70);
            summaryTable.setHorizontalAlignment(Element.ALIGN_CENTER);
            summaryTable.setSpacingAfter(16);
            addSummaryRow(summaryTable, "Total Bookings", String.valueOf(report.summary().totalBookings()), headerFont, cellFont);
            addSummaryRow(summaryTable, "Completed / Paid", String.valueOf(report.summary().completedBookings()), headerFont, cellFont);
            addSummaryRow(summaryTable, "Pending", String.valueOf(report.summary().pendingBookings()), headerFont, cellFont);
            addSummaryRow(summaryTable, "Cancelled", String.valueOf(report.summary().cancelledBookings()), headerFont, cellFont);
            addSummaryRow(summaryTable, "Total Revenue", "R" + report.summary().totalRevenue(), headerFont, cellFont);
            addSummaryRow(summaryTable, "Paid Revenue", "R" + report.summary().paidRevenue(), headerFont, cellFont);
            addSummaryRow(summaryTable, "Pending Revenue", "R" + report.summary().pendingRevenue(), headerFont, cellFont);
            doc.add(summaryTable);

            PdfPTable table = new PdfPTable(9);
            table.setWidthPercentage(100);
            table.setSpacingBefore(8);
            float[] widths = {0.6f, 1.6f, 1.4f, 1.0f, 1.1f, 0.9f, 1.1f, 1.3f, 0.9f};
            table.setWidths(widths);

            String[] headers = {"ID", "Customer", "Car", "City", "Status", "Payment", "Checkout", "Created", "Amount"};
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
                cell.setBackgroundColor(new Color(15, 52, 96));
                cell.setPadding(6);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            for (var b : report.bookings()) {
                addCell(table, String.valueOf(b.id()), cellFont, Element.ALIGN_CENTER);
                addCell(table, b.customerName(), cellFont, Element.ALIGN_LEFT);
                addCell(table, b.carName() != null ? b.carName() : "-", cellFont, Element.ALIGN_LEFT);
                addCell(table, b.city(), cellFont, Element.ALIGN_LEFT);
                addCell(table, b.status(), cellFont, Element.ALIGN_CENTER);
                addCell(table, b.paymentStatus(), cellFont, Element.ALIGN_CENTER);
                addCell(table, b.checkoutDate(), cellFont, Element.ALIGN_CENTER);
                addCell(table, b.createdAt(), cellFont, Element.ALIGN_CENTER);
                addCell(table, "R" + b.amount(), cellFont, Element.ALIGN_RIGHT);
            }

            doc.add(table);

            Paragraph footer = new Paragraph("MzansiRides (Pty) Ltd - Johannesburg, South Africa", cellFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(20);
            doc.add(footer);

            doc.close();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate PDF", e);
            throw new RuntimeException("PDF generation failed", e);
        }
    }

    private void addSummaryRow(PdfPTable table, String label, String value, Font headerFont, Font cellFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, headerFont));
        labelCell.setBackgroundColor(new Color(22, 33, 62));
        labelCell.setPadding(6);
        table.addCell(labelCell);
        PdfPCell valueCell = new PdfPCell(new Phrase(value, cellFont));
        valueCell.setPadding(6);
        valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(valueCell);
    }

    private void addCell(PdfPTable table, String text, Font font, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(5);
        cell.setHorizontalAlignment(alignment);
        table.addCell(cell);
    }
}
