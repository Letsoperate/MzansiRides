package com.mzansirides.controller;

import com.mzansirides.dto.BookingRequest;
import com.mzansirides.dto.ContactRequest;
import com.mzansirides.dto.DriverApplicationRequest;
import com.mzansirides.model.*;
import com.mzansirides.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final CarService carService;
    private final BookingService bookingService;
    private final DriverApplicationService driverApplicationService;
    private final SupportTicketService supportTicketService;
    private final ContactService contactService;
    private final EmailService emailService;
    private final FaqQuestionService faqQuestionService;

    public PublicController(CarService carService, BookingService bookingService,
                            DriverApplicationService driverApplicationService,
                            SupportTicketService supportTicketService,
                            ContactService contactService,
                            EmailService emailService,
                            FaqQuestionService faqQuestionService) {
        this.carService = carService;
        this.bookingService = bookingService;
        this.driverApplicationService = driverApplicationService;
        this.supportTicketService = supportTicketService;
        this.contactService = contactService;
        this.emailService = emailService;
        this.faqQuestionService = faqQuestionService;
    }

    @GetMapping("/cars")
    public List<Car> getCars(@RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            return carService.getCarsByCategory(category);
        }
        return carService.getAllCars();
    }

    @PostMapping("/bookings")
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest request) {
        Booking booking = new Booking();
        booking.setCustomerName(request.customerName());
        booking.setCity(request.city());
        booking.setCarName(request.carName());
        booking.setPhone(request.phone());
        booking.setEmail(request.email());
        booking.setCheckoutTime(request.checkoutTime());
        booking.setDropoffTime(request.dropoffTime());
        booking.setPickupType(request.pickupType() != null ? request.pickupType() : "SELF");
        booking.setPickupAddress(request.pickupAddress());
        booking.setPickupLat(request.pickupLat());
        booking.setPickupLng(request.pickupLng());
        booking.setExtras(request.extras());
        booking.setPaymentAmount(request.totalAmount());
        booking.setStatus("pending_approval");
        booking.setPaymentStatus("UNPAID");
        booking.setCheckoutDate(request.checkoutDate() != null ?
                LocalDate.parse(request.checkoutDate()) : LocalDate.now().plusDays(1));
        booking.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.create(booking));
    }

    @GetMapping("/booking/{token}")
    public ResponseEntity<?> getBookingByToken(@PathVariable String token) {
        try {
            Booking b = bookingService.getByToken(token);
            return ResponseEntity.ok(b);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("message", "Booking not found"));
        }
    }

    @PostMapping("/booking/{token}/confirm-payment")
    public ResponseEntity<?> confirmPayment(@PathVariable String token, @RequestBody Map<String, Object> body) {
        try {
            Booking b = bookingService.getByToken(token);
            String ref = (String) body.getOrDefault("paymentRef", "DEMO-"+System.currentTimeMillis());
            int amount = body.containsKey("amount") ? ((Number) body.get("amount")).intValue() : 0;
            Booking updated = bookingService.confirmPayment(b.getId(), ref, amount);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/drivers")
    public ResponseEntity<DriverApplication> applyAsDriver(@RequestBody DriverApplicationRequest request) {
        DriverApplication app = new DriverApplication();
        app.setApplicantName(request.applicantName());
        app.setEmail(request.email());
        app.setPhone(request.phone());
        app.setCity(request.city());
        app.setStatus("pending");
        app.setSubmittedAt(LocalDateTime.now());
        DriverApplication saved = driverApplicationService.createApplication(app);

        if (request.email() != null && !request.email().isBlank()) {
            try {
                emailService.sendDriverApplicationConfirmation(request.email(), request.applicantName());
            } catch (Exception ignored) {
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/contact")
    public ResponseEntity<ContactMessage> submitContact(@RequestBody ContactRequest request) {
        ContactMessage msg = new ContactMessage();
        msg.setName(request.name());
        msg.setEmail(request.email());
        msg.setSubject(request.subject());
        msg.setMessage(request.message());
        msg.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.CREATED).body(contactService.saveMessage(msg));
    }

    @PostMapping("/tickets")
    public ResponseEntity<SupportTicket> submitTicket(@RequestBody Map<String, String> body) {
        SupportTicket ticket = new SupportTicket();
        ticket.setCustomerName(body.get("customerName"));
        ticket.setEmail(body.get("email"));
        ticket.setSubject(body.get("subject"));
        ticket.setMessage(body.get("message"));
        ticket.setStatus("open");
        ticket.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.CREATED).body(supportTicketService.createTicket(ticket));
    }

    @PostMapping("/faqs")
    public ResponseEntity<FaqQuestion> submitFaq(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String question = body.get("question");
        if (email == null || email.isBlank() || question == null || question.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(faqQuestionService.submit(email, question));
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "database", "h2");
    }
}
