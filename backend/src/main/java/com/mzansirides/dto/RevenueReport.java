package com.mzansirides.dto;

import java.util.List;

public record RevenueReport(
    String startDate,
    String endDate,
    String generatedAt,
    Summary summary,
    List<BookingItem> bookings
) {
    public record Summary(
        int totalBookings,
        int completedBookings,
        int pendingBookings,
        int cancelledBookings,
        long totalRevenue,
        long paidRevenue,
        long pendingRevenue
    ) {}

    public record BookingItem(
        Long id,
        String customerName,
        String carName,
        String city,
        String status,
        String paymentStatus,
        String checkoutDate,
        String createdAt,
        int amount
    ) {}
}
