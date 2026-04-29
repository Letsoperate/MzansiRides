package com.mzansirides.dto;

public record ResetPasswordRequest(String token, String newPassword) {}
