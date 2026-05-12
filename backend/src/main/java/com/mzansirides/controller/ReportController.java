package com.mzansirides.controller;

import com.mzansirides.dto.RevenueReport;
import com.mzansirides.service.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/revenue")
    public ResponseEntity<?> getRevenueReport(
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end,
            @RequestParam(defaultValue = "csv") String format) {

        LocalDate startDate = (start != null && !start.isBlank())
                ? LocalDate.parse(start) : LocalDate.now().minusMonths(1);
        LocalDate endDate = (end != null && !end.isBlank())
                ? LocalDate.parse(end) : LocalDate.now();

        RevenueReport report = reportService.generateRevenueReport(startDate, endDate);

        if ("pdf".equalsIgnoreCase(format)) {
            byte[] pdf = reportService.generatePdf(report);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=revenue-report-" + startDate + "-to-" + endDate + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        }

        byte[] csv = reportService.generateCsv(report);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=revenue-report-" + startDate + "-to-" + endDate + ".csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
