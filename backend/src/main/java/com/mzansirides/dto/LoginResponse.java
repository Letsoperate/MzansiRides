package com.mzansirides.dto;

public record LoginResponse(String token, AdminInfo admin) {

    public record AdminInfo(Long id, String email, String fullName) {}
}
