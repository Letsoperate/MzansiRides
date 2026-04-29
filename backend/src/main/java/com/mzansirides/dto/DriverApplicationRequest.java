package com.mzansirides.dto;

public record DriverApplicationRequest(
    String applicantName,
    String email,
    String phone,
    String city
) {}
