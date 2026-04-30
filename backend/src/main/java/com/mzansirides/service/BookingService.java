package com.mzansirides.service;

import com.mzansirides.model.Booking;
import com.mzansirides.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class BookingService {

    private final BookingRepository repo;
    private final EmailService emailService;
    private final SecureRandom random = new SecureRandom();

    public BookingService(BookingRepository repo, EmailService emailService) {
        this.repo = repo; this.emailService = emailService;
    }

    public List<Booking> getAll() { return repo.findAll(); }
    public Booking getById(Long id) { return repo.findById(id).orElseThrow(() -> new RuntimeException("Not found")); }

    public Booking create(Booking b) {
        if (b.getStatus() == null) b.setStatus("pending_approval");
        if (b.getPaymentStatus() == null) b.setPaymentStatus("UNPAID");
        b.setCreatedAt(LocalDateTime.now());
        b.setBookingToken(generateToken());
        b = repo.save(b);

        if (b.getEmail() != null && !b.getEmail().isBlank()) {
            try { emailService.sendBookingReceived(b.getEmail(), b.getCustomerName(), b.getCarName()); } catch (Exception ignored) {}
        }
        return b;
    }

    public Booking approve(Long id, boolean auto) {
        Booking b = getById(id);
        b.setStatus("approved");
        b.setApprovedAt(LocalDateTime.now());
        b.setAutoApproved(auto);
        b = repo.save(b);

        if (b.getEmail() != null && !b.getEmail().isBlank()) {
            String paymentLink = "http://localhost:5173/payment/" + b.getBookingToken();
            try {
                emailService.sendPaymentLink(b.getEmail(), b.getCustomerName(),
                        b.getCarName(), b.getPaymentAmount() != null ? b.getPaymentAmount() : 0, paymentLink);
            } catch (Exception ignored) {}
        }
        return b;
    }

    public Booking confirmPayment(Long id, String payRef, int amount) {
        Booking b = getById(id);
        b.setPaymentStatus("PAID");
        b.setPaymentRef(payRef);
        b.setPaymentAmount(amount);
        b.setPaidAt(LocalDateTime.now());
        b.setReceiptNumber("MZR-" + String.format("%06d", id) + "-" + LocalDateTime.now().getYear());
        b.setStatus("active");
        b = repo.save(b);

        if (b.getEmail() != null && !b.getEmail().isBlank()) {
            try {
                emailService.sendReceipt(b.getEmail(), b.getCustomerName(), b.getCarName(),
                        b.getReceiptNumber(), amount, payRef, b.getCheckoutDate() != null ? b.getCheckoutDate().toString() : "");
            } catch (Exception ignored) {}
        }
        return b;
    }

    public Booking reject(Long id) {
        Booking b = getById(id);
        b.setStatus("rejected");
        return repo.save(b);
    }

    public Booking updateStatus(Long id, String status) {
        Booking b = getById(id);
        b.setStatus(status); return repo.save(b);
    }

    public void delete(Long id) { repo.deleteById(id); }

    public Booking getByToken(String token) {
        return repo.findByBookingToken(token).orElseThrow(() -> new RuntimeException("Invalid token"));
    }

    private String generateToken() {
        byte[] bytes = new byte[24];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
