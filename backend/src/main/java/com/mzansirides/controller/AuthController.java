package com.mzansirides.controller;

import com.mzansirides.dto.LoginRequest;
import com.mzansirides.dto.LoginResponse;
import com.mzansirides.model.Admin;
import com.mzansirides.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank() ||
            request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email and password are required"));
        }

        try {
            AuthService.LoginResult result = authService.login(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(Map.of(
                "token", result.token(),
                "admin", Map.of(
                    "id", result.admin().getId(),
                    "email", result.admin().getEmail(),
                    "fullName", result.admin().getFullName(),
                    "role", result.admin().getRole()
                ),
                "mustChangePassword", result.admin().isMustChangePassword()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body,
                                             @RequestAttribute("userId") Long adminId) {
        try {
            String currentPassword = body.get("currentPassword");
            String newPassword = body.get("newPassword");

            if (currentPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Both current and new password required"));
            }

            authService.changePassword(adminId, currentPassword, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
