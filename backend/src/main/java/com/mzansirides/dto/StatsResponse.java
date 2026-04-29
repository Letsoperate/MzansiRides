package com.mzansirides.dto;

import java.util.List;
import java.util.Map;

public record StatsResponse(
    List<StatItem> stats,
    BookingOverview bookingOverview
) {
    public record StatItem(Long id, String label, String value) {}

    public record BookingOverview(long johannesburg, long capeTown, long durban) {}
}
