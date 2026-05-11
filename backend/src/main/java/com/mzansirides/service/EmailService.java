package com.mzansirides.service;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String fromAddress;
    private final String siteUrl;

    public EmailService(JavaMailSender mailSender,
                        @Value("${mail.from:no-reply@mzansirides.co.za}") String fromAddress,
                        @Value("${site.url:" + siteUrl + "}") String siteUrl) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
        this.siteUrl = siteUrl;
        log.info("EmailService initialized with from address: {}, site URL: {}", fromAddress, siteUrl);
    }

    public void sendVerificationEmail(String to, String fullName, String token) {
        String subject = "MzansiRides - Verify Your Email Address";
        String link = siteUrl + "/verify-email?token=" + token;
        String body = buildEmailTemplate("Verify Your Email",
                "Welcome to MzansiRides, " + fullName + "!",
                "Thanks for signing up. Please verify your email to start booking rides.",
                "Verify Email", link,
                "If you didn't create this account, please ignore this email.");
        sendHtml(to, subject, body);
    }

    public void sendPasswordResetEmail(String to, String fullName, String token) {
        String subject = "MzansiRides - Reset Your Password";
        String link = "" + siteUrl + "/reset-password?token=" + token;
        String body = buildEmailTemplate("Reset Your Password",
                "Hi " + fullName + ",",
                "You requested to reset your password. Click the button below to create a new password.",
                "Reset Password", link,
                "If you didn't request this, please ignore this email. The link expires in 1 hour.");
        sendHtml(to, subject, body);
    }

    public void sendBookingConfirmation(String to, String fullName, String carName, String city, String checkoutDate) {
        String subject = "MzansiRides - Booking Confirmed";
        String body = buildBookingTemplate(fullName, carName, city, checkoutDate);
        sendEmail(to, subject, body);
    }

    public void sendBookingReceived(String to, String fullName, String carName) {
        String subject = "MzansiRides - Booking Received";
        String body = """
            <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
            <body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#1a1a2e;color:#e0e0e0">
            <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#1a1a2e;padding:40px 0">
            <tr><td align="center"><table width="560" style="background-color:#16213e;border-radius:12px;overflow:hidden">
            <tr><td style="background-color:#0f3460;padding:30px 40px;text-align:center">
            <h1 style="margin:0;color:#e94560;font-size:26px">MzansiRides</h1>
            <p style="margin:8px 0 0;color:#a0a0b0;font-size:14px">Booking Received</p></td></tr>
            <tr><td style="padding:40px">
            <h2 style="margin:0 0 16px;color:#fff;font-size:22px">Booking Received</h2>
            <p style="margin:0 0 8px;color:#c0c0d0;font-size:15px">Hi %s,</p>
            <p style="margin:0 0 24px;color:#a0a0b0;font-size:14px;line-height:1.6">Your booking for <strong>%s</strong> has been received and is pending approval. You will receive an email once it's reviewed.</p>
            </td></tr>
            <tr><td style="background-color:#0f3460;padding:20px 40px;text-align:center">
            <p style="margin:0;color:#707080;font-size:11px">&copy; %d MzansiRides</p></td></tr>
            </table></td></tr></table></body></html>
            """.formatted(fullName, carName != null ? carName : "Vehicle", java.time.Year.now().getValue());
        sendEmail(to, subject, body);
    }

    public void sendPaymentLink(String to, String fullName, String carName, int amount, String link) {
        String subject = "MzansiRides - Booking Approved - Complete Payment";
        String body = """
            <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
            <body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#1a1a2e;color:#e0e0e0">
            <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#1a1a2e;padding:40px 0">
            <tr><td align="center"><table width="560" style="background-color:#16213e;border-radius:12px;overflow:hidden">
            <tr><td style="background-color:#0f3460;padding:30px 40px;text-align:center">
            <h1 style="margin:0;color:#e94560;font-size:26px">MzansiRides</h1>
            <p style="margin:8px 0 0;color:#a0a0b0;font-size:14px">Booking Approved</p></td></tr>
            <tr><td style="padding:40px">
            <h2 style="margin:0 0 16px;color:#fff;font-size:22px">Your Booking is Approved!</h2>
            <p style="margin:0 0 8px;color:#c0c0d0;font-size:15px">Hi %s, your booking for <strong>%s</strong> has been approved.</p>
            <p style="margin:0 0 8px;color:#f59e0b;font-size:20px;font-weight:700">Amount: R%s</p>
            <p style="margin:0 0 24px;color:#a0a0b0;font-size:14px">Click below to complete payment and confirm your reservation.</p>
            <table cellpadding="0" cellspacing="0"><tr><td align="center" style="background-color:#e94560;border-radius:8px">
            <a href="%s" style="display:inline-block;padding:14px 36px;color:#fff;text-decoration:none;font-size:15px;font-weight:700">Pay Now</a>
            </td></tr></table></td></tr>
            <tr><td style="background-color:#0f3460;padding:20px 40px;text-align:center">
            <p style="margin:0;color:#707080;font-size:11px">&copy; %d MzansiRides</p></td></tr>
            </table></td></tr></table></body></html>
            """.formatted(fullName, carName != null ? carName : "Vehicle", String.valueOf(amount), link, java.time.Year.now().getValue());
        sendEmail(to, subject, body);
    }

    public void sendReceipt(String to, String fullName, String carName, String receiptNo, int amount, String ref, String date) {
        String subject = "MzansiRides - Payment Receipt #" + receiptNo;
        String body = """
            <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
            <body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#1a1a2e;color:#e0e0e0">
            <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#1a1a2e;padding:40px 0">
            <tr><td align="center"><table width="560" style="background-color:#16213e;border-radius:12px;overflow:hidden">
            <tr><td style="background-color:#0f3460;padding:30px 40px;text-align:center">
            <h1 style="margin:0;color:#e94560;font-size:26px">MzansiRides</h1>
            <p style="margin:8px 0 0;color:#a0a0b0;font-size:14px">Payment Receipt</p></td></tr>
            <tr><td style="padding:40px">
            <h2 style="margin:0 0 16px;color:#4ade80;font-size:22px">Payment Confirmed!</h2>
            <table cellpadding="8" style="background-color:#1a1a2e;border-radius:8px;width:100%%">
            <tr><td style="color:#a0a0b0;font-size:13px;font-weight:600">Receipt No</td><td style="color:#e0e0e0;font-size:14px">%s</td></tr>
            <tr><td style="color:#a0a0b0;font-size:13px;font-weight:600">Customer</td><td style="color:#e0e0e0;font-size:14px">%s</td></tr>
            <tr><td style="color:#a0a0b0;font-size:13px;font-weight:600">Vehicle</td><td style="color:#e0e0e0;font-size:14px">%s</td></tr>
            <tr><td style="color:#a0a0b0;font-size:13px;font-weight:600">Amount Paid</td><td style="color:#4ade80;font-size:16px;font-weight:700">R%s</td></tr>
            <tr><td style="color:#a0a0b0;font-size:13px;font-weight:600">Reference</td><td style="color:#e0e0e0;font-size:14px">%s</td></tr>
            <tr><td style="color:#a0a0b0;font-size:13px;font-weight:600">Date</td><td style="color:#e0e0e0;font-size:14px">%s</td></tr>
            </table></td></tr>
            <tr><td style="background-color:#0f3460;padding:20px 40px;text-align:center">
            <p style="margin:0;color:#707080;font-size:11px">&copy; %d MzansiRides</p></td></tr>
            </table></td></tr></table></body></html>
            """.formatted(receiptNo, fullName, carName != null ? carName : "Vehicle", String.valueOf(amount), ref, date, java.time.Year.now().getValue());
        sendEmail(to, subject, body);
    }

    public void sendWelcomeEmail(String to, String fullName) {
        String subject = "Welcome to MzansiRides!";
        String body = buildEmailTemplate("Welcome Aboard!",
                "Hi " + fullName + ",",
                "Your MzansiRides account has been created successfully. Start browsing our fleet and book your next ride.",
                "Browse Cars", "" + siteUrl + "/cars/All",
                "Drive safe, MzansiRides Team");
        sendHtml(to, subject, body);
    }

    public void sendRegistrationConfirmation(String to, String fullName) {
        String subject = "MzansiRides - Registration Successful";
        String body = buildEmailTemplate("Registration Successful",
                "Welcome to MzansiRides, " + fullName + "!",
                "Your account is now active. Please check your inbox for a verification email.",
                "Go to MzansiRides", "" + siteUrl + "/home",
                "Thank you for joining MzansiRides!");
        sendHtml(to, subject, body);
    }

    public void sendDriverApplicationConfirmation(String to, String fullName) {
        String subject = "MzansiRides - Driver Application Received";
        String body = buildEmailTemplate("Application Received",
                "Hi " + fullName + ",",
                "Thank you for applying to become a driver with MzansiRides. Our team will review your application and get back to you within 3-5 business days.",
                "Visit MzansiRides", "" + siteUrl + "/home",
                "We look forward to having you on our team!");
        sendHtml(to, subject, body);
    }

    public void sendDriverApprovalEmail(String to, String fullName) {
        String subject = "MzansiRides - Driver Application Approved!";
        String body = buildEmailTemplate("Congratulations!",
                "Hi " + fullName + ",",
                "Great news! Your driver application has been approved. Welcome to the MzansiRides fleet.",
                "Login to Dashboard", "" + siteUrl + "/sign-in",
                "Welcome aboard, MzansiRides Team");
        sendHtml(to, subject, body);
    }

    private String buildEmailTemplate(String title, String greeting, String message, String buttonText, String buttonLink, String footerText) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
            <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#1a1a2e;color:#e0e0e0">
            <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#1a1a2e;padding:40px 0">
            <tr><td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background-color:#16213e;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.3)">
            <tr><td style="background-color:#0f3460;padding:30px 40px;text-align:center">
            <h1 style="margin:0;color:#e94560;font-size:26px;font-weight:700">MzansiRides</h1>
            <p style="margin:8px 0 0;color:#a0a0b0;font-size:14px">Drive Mzansi, Your Way</p>
            </td></tr>
            <tr><td style="padding:40px">
            <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px">%s</h2>
            <p style="margin:0 0 8px;color:#c0c0d0;font-size:15px;line-height:1.6">%s</p>
            <p style="margin:0 0 24px;color:#a0a0b0;font-size:14px;line-height:1.6">%s</p>
            <table cellpadding="0" cellspacing="0"><tr><td align="center" style="background-color:#e94560;border-radius:8px">
            <a href="%s" style="display:inline-block;padding:14px 36px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700">%s</a>
            </td></tr></table>
            <p style="margin:24px 0 0;color:#707080;font-size:12px;line-height:1.5">%s</p>
            </td></tr>
            <tr><td style="background-color:#0f3460;padding:20px 40px;text-align:center">
            <p style="margin:0;color:#707080;font-size:11px">&copy; %d MzansiRides. All rights reserved.</p>
            <p style="margin:4px 0 0;color:#707080;font-size:11px">Johannesburg, South Africa</p>
            </td></tr>
            </table>
            </td></tr>
            </table>
            </body>
            </html>
            """.formatted(title, greeting, message, buttonLink, buttonText, footerText, java.time.Year.now().getValue());
    }

    private String buildBookingTemplate(String fullName, String carName, String city, String checkoutDate) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
            <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#1a1a2e;color:#e0e0e0">
            <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#1a1a2e;padding:40px 0">
            <tr><td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background-color:#16213e;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.3)">
            <tr><td style="background-color:#0f3460;padding:30px 40px;text-align:center">
            <h1 style="margin:0;color:#e94560;font-size:26px;font-weight:700">MzansiRides</h1>
            <p style="margin:8px 0 0;color:#a0a0b0;font-size:14px">Booking Confirmation</p>
            </td></tr>
            <tr><td style="padding:40px">
            <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px">Booking Confirmed!</h2>
            <p style="margin:0 0 16px;color:#c0c0d0;font-size:15px;line-height:1.6">Hi %s, your booking has been confirmed.</p>
            <table cellpadding="8" cellspacing="0" style="background-color:#1a1a2e;border-radius:8px;width:100%%">
            <tr><td style="color:#a0a0b0;font-size:13px;font-weight:600;padding:10px 16px">Vehicle</td><td style="color:#e0e0e0;font-size:14px;padding:10px 16px">%s</td></tr>
            <tr><td style="color:#a0a0b0;font-size:13px;font-weight:600;padding:10px 16px">City</td><td style="color:#e0e0e0;font-size:14px;padding:10px 16px">%s</td></tr>
            <tr><td style="color:#a0a0b0;font-size:13px;font-weight:600;padding:10px 16px">Checkout Date</td><td style="color:#e0e0e0;font-size:14px;padding:10px 16px">%s</td></tr>
            </table>
            <table cellpadding="0" cellspacing="0" style="margin-top:24px"><tr><td align="center" style="background-color:#e94560;border-radius:8px">
            <a href="" + siteUrl + "/home" style="display:inline-block;padding:14px 36px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700">View Booking</a>
            </td></tr></table>
            </td></tr>
            <tr><td style="background-color:#0f3460;padding:20px 40px;text-align:center">
            <p style="margin:0;color:#707080;font-size:11px">&copy; %d MzansiRides. All rights reserved.</p>
            </td></tr>
            </table>
            </td></tr>
            </table>
            </body>
            </html>
            """.formatted(fullName, carName, city, checkoutDate, java.time.Year.now().getValue());
    }

    public void sendHtml(String to, String subject, String body) {
        sendEmail(to, subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(new InternetAddress(fromAddress, "MzansiRides"));
            helper.setReplyTo(new InternetAddress("hello@mzansirides.co.za", "MzansiRides Support"));
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
        } catch (Exception e) {
            log.error("[Email] Failed to send '{}' to {}: {}", subject, to, e.getMessage(), e);
        }
    }
}
