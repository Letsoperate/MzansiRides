package com.mzansirides.security;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKeySpec key;
    private final long expiration;

    public JwtUtil(@Value("${admin.jwt.secret}") String secret,
                   @Value("${admin.jwt.expiration}") long expiration) {
        this.key = buildKey(secret);
        this.expiration = expiration;
    }

    private SecretKeySpec buildKey(String secret) {
        try {
            MessageDigest sha = MessageDigest.getInstance("SHA-256");
            byte[] hash = sha.digest(secret.getBytes(StandardCharsets.UTF_8));
            return new SecretKeySpec(hash, "HmacSHA256");
        } catch (NoSuchAlgorithmException e) {
            byte[] padded = Arrays.copyOf(secret.getBytes(StandardCharsets.UTF_8), 32);
            return new SecretKeySpec(padded, "HmacSHA256");
        }
    }

    public String generateToken(Long adminId, String email, String fullName) {
        return buildToken(adminId, email, fullName, "ROLE_ADMIN", "ADMIN");
    }

    public String generateToken(Long adminId, String email, String fullName, String adminRole) {
        return buildToken(adminId, email, fullName, "ROLE_ADMIN", adminRole);
    }

    public String generateUserToken(Long userId, String email, String fullName) {
        return buildToken(userId, email, fullName, "ROLE_USER", "USER");
    }

    private String buildToken(Long id, String email, String fullName, String role, String adminRole) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expiration);
        var builder = Jwts.builder()
                .subject(email)
                .claim("id", id)
                .claim("email", email)
                .claim("fullName", fullName)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiry);
        if (adminRole != null) {
            builder.claim("adminRole", adminRole);
        }
        return builder.signWith(key).compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
