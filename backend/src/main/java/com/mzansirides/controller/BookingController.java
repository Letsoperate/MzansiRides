package com.mzansirides.controller;

import com.mzansirides.dto.StatusUpdateRequest;
import com.mzansirides.model.Booking;
import com.mzansirides.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/bookings")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) { this.service = service; }

    @GetMapping
    public List<Booking> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> get(@PathVariable Long id) {
        try { return ResponseEntity.ok(service.getById(id)); }
        catch (RuntimeException e) { return ResponseEntity.notFound().build(); }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest r) {
        try { return ResponseEntity.ok(service.updateStatus(id, r.status())); }
        catch (RuntimeException e) { return ResponseEntity.notFound().build(); }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Booking> approve(@PathVariable Long id, @RequestBody Map<String, Object> body,
                                            @RequestAttribute("userEmail") String adminEmail) {
        try {
            boolean auto = body.containsKey("auto") && Boolean.TRUE.equals(body.get("auto"));
            return ResponseEntity.ok(service.approve(id, auto, adminEmail));
        } catch (RuntimeException e) { return ResponseEntity.notFound().build(); }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Booking> reject(@PathVariable Long id,
                                           @RequestAttribute("userEmail") String adminEmail) {
        try { return ResponseEntity.ok(service.reject(id, adminEmail)); }
        catch (RuntimeException e) { return ResponseEntity.notFound().build(); }
    }

    @PutMapping("/{id}/confirm-payment")
    public ResponseEntity<Booking> confirmPayment(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            String ref = (String) body.getOrDefault("paymentRef", "DEMO-"+System.currentTimeMillis());
            int amount = body.containsKey("amount") ? ((Number) body.get("amount")).intValue() : 0;
            return ResponseEntity.ok(service.confirmPayment(id, ref, amount));
        } catch (RuntimeException e) { return ResponseEntity.notFound().build(); }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id); return ResponseEntity.ok().build();
    }
}
