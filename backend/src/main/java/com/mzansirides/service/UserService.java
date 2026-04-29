package com.mzansirides.service;

import com.mzansirides.model.User;
import com.mzansirides.repository.UserRepository;
import com.mzansirides.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    public UserService(UserRepository userRepository, JwtUtil jwtUtil,
                       PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public record LoginResult(String token, User user) {}

    public User register(String fullName, String email, String password, String phone) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("An account with this email already exists");
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email.toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setPhone(phone);
        user.setCreatedAt(LocalDateTime.now());
        user.setEmailVerified(false);
        user.setVerificationToken(generateToken());
        user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));

        user = userRepository.save(user);

        emailService.sendRegistrationConfirmation(user.getEmail(), user.getFullName());
        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), user.getVerificationToken());

        return user;
    }

    public LoginResult login(String email, String password) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Please verify your email address before logging in. Check your inbox for the verification link.");
        }

        String token = jwtUtil.generateUserToken(user.getId(), user.getEmail(), user.getFullName());
        return new LoginResult(token, user);
    }

    public void resendVerification(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("If that email is registered, a verification link has been sent"));

        if (user.isEmailVerified()) {
            return;
        }

        user.setVerificationToken(generateToken());
        user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), user.getVerificationToken());
    }

    public User verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification token has expired");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        user = userRepository.save(user);

        emailService.sendWelcomeEmail(user.getEmail(), user.getFullName());
        return user;
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("If that email exists, a reset link has been sent"));

        user.setResetToken(generateToken());
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        user = userRepository.save(user);

        emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), user.getResetToken());
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
