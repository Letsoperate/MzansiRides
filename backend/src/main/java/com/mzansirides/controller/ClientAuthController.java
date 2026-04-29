package com.mzansirides.controller;

import com.mzansirides.dto.*;
import com.mzansirides.model.User;
import com.mzansirides.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class ClientAuthController {

    private final UserService userService;

    public ClientAuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (isBlank(request.fullName()) || isBlank(request.email()) || isBlank(request.password())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Full name, email, and password are required"));
        }

        if (request.password().length() < 8) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password must be at least 8 characters"));
        }

        try {
            User user = userService.register(
                    request.fullName(), request.email(), request.password(), request.phone());
            return ResponseEntity.ok(Map.of(
                    "message", "Registration successful. Please check your email to verify your account.",
                    "user", Map.of("id", user.getId(), "email", user.getEmail(), "fullName", user.getFullName())
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequest request) {
        if (isBlank(request.email()) || isBlank(request.password())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email and password are required"));
        }

        try {
            UserService.LoginResult result = userService.login(request.email(), request.password());
            return ResponseEntity.ok(new UserLoginResponse(
                    result.token(),
                    new UserLoginResponse.UserInfo(
                            result.user().getId(), result.user().getEmail(),
                            result.user().getFullName(), result.user().isEmailVerified())
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        try {
            userService.verifyEmail(token);
            return ResponseEntity.ok(Map.of("message", "Email verified successfully. You can now log in."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (isBlank(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }
        try {
            userService.resendVerification(email);
        } catch (RuntimeException ignored) {}
        return ResponseEntity.ok(Map.of("message", "If that email is registered and not yet verified, a new verification link has been sent."));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        if (isBlank(request.email())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }

        try {
            userService.forgotPassword(request.email());
        } catch (RuntimeException ignored) {
        }

        return ResponseEntity.ok(Map.of("message", "If that email is registered, a password reset link has been sent"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        if (isBlank(request.token()) || isBlank(request.newPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Token and new password are required"));
        }

        if (request.newPassword().length() < 8) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password must be at least 8 characters"));
        }

        try {
            userService.resetPassword(request.token(), request.newPassword());
            return ResponseEntity.ok(Map.of("message", "Password reset successfully. You can now log in."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(@RequestAttribute(value = "userId", required = false) Long userId) {
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        try {
            User user = userService.getById(userId);
            return ResponseEntity.ok(Map.of(
                    "id", user.getId(), "email", user.getEmail(),
                    "fullName", user.getFullName(), "phone", user.getPhone(),
                    "emailVerified", user.isEmailVerified()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
