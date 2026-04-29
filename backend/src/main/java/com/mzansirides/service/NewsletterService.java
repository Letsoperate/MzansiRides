package com.mzansirides.service;

import com.mzansirides.model.Subscriber;
import com.mzansirides.repository.SubscriberRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
public class NewsletterService {

    private final SubscriberRepository subscriberRepository;
    private final EmailService emailService;
    private final SecureRandom random = new SecureRandom();

    public NewsletterService(SubscriberRepository subscriberRepository, EmailService emailService) {
        this.subscriberRepository = subscriberRepository;
        this.emailService = emailService;
    }

    public record SendResult(int total, int sent, int failed) {}

    public Subscriber subscribe(String email) {
        email = email.toLowerCase().trim();
        var existing = subscriberRepository.findByEmail(email);

        if (existing.isPresent()) {
            Subscriber sub = existing.get();
            if (!sub.isSubscribed()) {
                sub.setSubscribed(true);
                sub.setUnsubscribedAt(null);
                sub.setUnsubscribeToken(generateToken());
                sub = subscriberRepository.save(sub);
                emailService.sendWelcomeEmail(sub.getEmail(), "MzansiRides Subscriber");
            }
            return sub;
        }

        Subscriber sub = new Subscriber();
        sub.setEmail(email);
        sub.setSubscribed(true);
        sub.setUnsubscribeToken(generateToken());
        sub.setCreatedAt(LocalDateTime.now());
        sub = subscriberRepository.save(sub);

        emailService.sendWelcomeEmail(sub.getEmail(), "MzansiRides Subscriber");
        return sub;
    }

    public void unsubscribe(String token) {
        var sub = subscriberRepository.findByUnsubscribeToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid unsubscribe token"));
        sub.setSubscribed(false);
        sub.setUnsubscribedAt(LocalDateTime.now());
        sub.setUnsubscribeToken(null);
        subscriberRepository.save(sub);
    }

    public List<Subscriber> getActiveSubscribers() {
        return subscriberRepository.findBySubscribedTrue();
    }

    public long getSubscriberCount() {
        return subscriberRepository.countBySubscribedTrue();
    }

    public SendResult sendToAll(String subject, String message) {
        List<Subscriber> subs = getActiveSubscribers();
        int sent = 0;
        int failed = 0;
        for (Subscriber s : subs) {
            try {
                String body = buildNewsletterEmail(s.getEmail(), s.getUnsubscribeToken(), subject, message);
                emailService.sendHtml(s.getEmail(), subject, body);
                sent++;
            } catch (Exception e) {
                failed++;
            }
        }
        return new SendResult(subs.size(), sent, failed);
    }

    private String buildNewsletterEmail(String email, String unsubscribeToken, String subject, String message) {
        String unsubLink = "http://localhost:5173/unsubscribe?token=" + (unsubscribeToken != null ? unsubscribeToken : "");
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#1a1a2e;color:#e0e0e0">
            <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#1a1a2e;padding:40px 0">
            <tr><td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background-color:#16213e;border-radius:12px;overflow:hidden">
            <tr><td style="background-color:#0f3460;padding:30px 40px;text-align:center">
            <h1 style="margin:0;color:#e94560;font-size:26px">MzansiRides</h1>
            <p style="margin:8px 0 0;color:#a0a0b0;font-size:14px">Newsletter</p>
            </td></tr>
            <tr><td style="padding:40px">
            <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px">%s</h2>
            <p style="margin:0 0 24px;color:#c0c0d0;font-size:15px;line-height:1.6">%s</p>
            <p style="margin:24px 0 0;color:#707080;font-size:11px">
            You received this because you subscribed to MzansiRides.
            <a href="%s" style="color:#e94560">Unsubscribe</a>
            </p>
            </td></tr>
            </table>
            </td></tr>
            </table>
            </body>
            </html>
            """.formatted(subject, message, unsubLink);
    }

    private String generateToken() {
        byte[] bytes = new byte[24];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
