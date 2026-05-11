package com.mzansirides.controller;

import com.mzansirides.model.Admin;
import com.mzansirides.repository.AdminRepository;
import com.mzansirides.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    @PostMapping
    public ResponseEntity<?> createAdmin(@RequestBody Map<String, String> body,
                                          @RequestAttribute("userEmail") String createdByEmail,
                                          @RequestAttribute(value = "adminRole", required = false) String adminRole) {
        if (!"SUPER_ADMIN".equals(adminRole)) {
            return ResponseEntity.status(403).body(Map.of("message", "Only super admin can add admins"));
        }

        String email = body.get("email");
        String fullName = body.get("fullName");
        String password = body.get("password");

        if (email == null || fullName == null || password == null || password.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("message", "All fields required, password min 6 chars"));
        }

        if (adminRepo.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Admin with this email already exists"));
        }

        Admin admin = new Admin();
        admin.setEmail(email);
        admin.setFullName(fullName);
        admin.setPasswordHash(encoder.encode(password));
        admin.setRole("ADMIN");
        admin.setActive(true);
        admin.setCreatedAt(LocalDateTime.now());
        admin.setCreatedBy(createdByEmail);
        adminRepo.save(admin);

        try {
            emailService.sendAdminCreatedEmail(email, fullName, password);
        } catch (Exception e) {
            // Email failure shouldn't block admin creation
        }

        return ResponseEntity.ok(Map.of("message", "Admin created", "id", admin.getId()));
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
