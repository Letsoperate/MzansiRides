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
            return ResponseEntity.ok(new LoginResponse(
                result.token(),
                new LoginResponse.AdminInfo(result.admin().getId(),
                    result.admin().getEmail(),
                    result.admin().getFullName(),
                    result.admin().getRole())
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }
    }
}
