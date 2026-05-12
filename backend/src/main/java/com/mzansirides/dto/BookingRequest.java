package com.mzansirides.dto;

public record BookingRequest(
    String customerName, String city, String carName, String phone, String email,
    String checkoutDate, String checkoutTime, String dropoffTime, String dropoffDate,
    String pickupType, String pickupAddress, Double pickupLat, Double pickupLng,
    String extras, Integer totalAmount
) {}
