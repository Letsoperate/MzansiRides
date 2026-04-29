package com.mzansirides.dto;

public record RegisterRequest(
    String fullName,
    String email,
    String password,
    String phone
) {}
