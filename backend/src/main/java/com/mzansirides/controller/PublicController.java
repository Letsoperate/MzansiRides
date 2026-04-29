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

    public PublicController(CarService carService, BookingService bookingService,
                            DriverApplicationService driverApplicationService,
                            SupportTicketService supportTicketService,
                            ContactService contactService,
                            EmailService emailService) {
        this.carService = carService;
        this.bookingService = bookingService;
        this.driverApplicationService = driverApplicationService;
        this.supportTicketService = supportTicketService;
        this.contactService = contactService;
        this.emailService = emailService;
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
        booking.setStatus("pending");
        booking.setCheckoutDate(request.checkoutDate() != null ?
                LocalDate.parse(request.checkoutDate()) : LocalDate.now().plusDays(1));
        booking.setCreatedAt(LocalDateTime.now());
        Booking saved = bookingService.createBooking(booking);

        if (request.email() != null && !request.email().isBlank()) {
            try {
                emailService.sendBookingConfirmation(
                        request.email(), request.customerName(),
                        request.carName() != null ? request.carName() : "Vehicle",
                        request.city() != null ? request.city() : "Not specified",
                        saved.getCheckoutDate().toString());
            } catch (Exception ignored) {
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
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

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "database", "h2");
    }
}
