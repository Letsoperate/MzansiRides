package com.mzansirides.dto;

public record UserLoginResponse(String token, UserInfo user) {

    public record UserInfo(Long id, String email, String fullName, boolean emailVerified) {}
}
