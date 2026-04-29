package com.mzansirides.dto;

public record BookingRequest(
    String customerName,
    String city,
    String carName,
    String phone,
    String email,
    String checkoutDate
) {}
