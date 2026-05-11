package com.mzansirides.controller;

import com.mzansirides.model.Admin;
import com.mzansirides.repository.AdminRepository;
import com.mzansirides.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminRepository adminRepo;
    private final PasswordEncoder encoder;
    private final EmailService emailService;

    public AdminUserController(AdminRepository adminRepo, PasswordEncoder encoder, EmailService emailService) {
        this.adminRepo = adminRepo;
        this.encoder = encoder;
        this.emailService = emailService;
    }

    @GetMapping
    public ResponseEntity<List<Admin>> listAdmins(@RequestAttribute(value = "adminRole", required = false) String adminRole) {
        if (!"SUPER_ADMIN".equals(adminRole)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(adminRepo.findAll());
    }

    private static final SecureRandom RANDOM = new SecureRandom();

    @PostMapping
    public ResponseEntity<?> createAdmin(@RequestBody Map<String, String> body,
                                          @RequestAttribute("userEmail") String createdByEmail,
                                          @RequestAttribute(value = "adminRole", required = false) String adminRole) {
        if (!"SUPER_ADMIN".equals(adminRole)) {
            return ResponseEntity.status(403).body(Map.of("message", "Only super admin can add admins"));
        }

        String email = body.get("email");
        String fullName = body.get("fullName");

        if (email == null || fullName == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Full name and email are required"));
        }

        if (adminRepo.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Admin with this email already exists"));
        }

        String tempPassword = generateTempPassword();

        Admin admin = new Admin();
        admin.setEmail(email);
        admin.setFullName(fullName);
        admin.setPasswordHash(encoder.encode(tempPassword));
        admin.setRole("ADMIN");
        admin.setActive(true);
        admin.setMustChangePassword(true);
        admin.setCreatedAt(LocalDateTime.now());
        admin.setCreatedBy(createdByEmail);
        adminRepo.save(admin);

        try {
            emailService.sendAdminCreatedEmail(email, fullName, tempPassword);
        } catch (Exception e) {
            // Email failure shouldn't block admin creation
        }

        return ResponseEntity.ok(Map.of("message", "Admin created", "id", admin.getId()));
    }

    private String generateTempPassword() {
        byte[] bytes = new byte[9];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggleAdmin(@PathVariable Long id,
                                          @RequestAttribute(value = "adminRole", required = false) String adminRole) {
        if (!"SUPER_ADMIN".equals(adminRole)) {
            return ResponseEntity.status(403).body(Map.of("message", "Only super admin can modify admins"));
        }

        Admin admin = adminRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if ("SUPER_ADMIN".equals(admin.getRole())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cannot deactivate super admin"));
        }

        admin.setActive(!admin.isActive());
        adminRepo.save(admin);
        return ResponseEntity.ok(Map.of("message", admin.isActive() ? "Admin activated" : "Admin deactivated", "active", admin.isActive()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id,
                                          @RequestAttribute(value = "adminRole", required = false) String adminRole) {
        if (!"SUPER_ADMIN".equals(adminRole)) {
            return ResponseEntity.status(403).body(Map.of("message", "Only super admin can delete admins"));
        }

        Admin admin = adminRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if ("SUPER_ADMIN".equals(admin.getRole())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cannot delete super admin"));
        }

        adminRepo.delete(admin);
        return ResponseEntity.ok(Map.of("message", "Admin deleted"));
    }
}
