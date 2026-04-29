package com.mzansirides.controller;

import com.mzansirides.model.Subscriber;
import com.mzansirides.service.NewsletterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class NewsletterController {

    private final NewsletterService newsletterService;

    public NewsletterController(NewsletterService newsletterService) {
        this.newsletterService = newsletterService;
    }

    @PostMapping("/api/public/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }
        Subscriber sub = newsletterService.subscribe(email);
        return ResponseEntity.ok(Map.of(
                "message", "Successfully subscribed to MzansiRides newsletter",
                "email", sub.getEmail()
        ));
    }

    @GetMapping("/api/public/unsubscribe")
    public ResponseEntity<?> unsubscribe(@RequestParam String token) {
        try {
            newsletterService.unsubscribe(token);
            return ResponseEntity.ok(Map.of("message", "Successfully unsubscribed. You will no longer receive emails from MzansiRides."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/api/admin/subscribers")
    public ResponseEntity<List<Subscriber>> getSubscribers() {
        return ResponseEntity.ok(newsletterService.getActiveSubscribers());
    }

    @GetMapping("/api/admin/subscribers/count")
    public ResponseEntity<Map<String, Long>> getSubscriberCount() {
        return ResponseEntity.ok(Map.of("count", newsletterService.getSubscriberCount()));
    }

    @PostMapping("/api/admin/subscribers/send")
    public ResponseEntity<?> sendNewsletter(@RequestBody Map<String, String> body) {
        String subject = body.get("subject");
        String message = body.get("message");
        if (subject == null || subject.isBlank() || message == null || message.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Subject and message are required"));
        }
        NewsletterService.SendResult result = newsletterService.sendToAll(subject, message);
        return ResponseEntity.ok(Map.of(
                "message", "Newsletter sent",
                "total", result.total(),
                "sent", result.sent(),
                "failed", result.failed()
        ));
    }
}
