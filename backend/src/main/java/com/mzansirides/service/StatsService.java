package com.mzansirides.service;

import com.mzansirides.dto.StatsResponse;
import com.mzansirides.repository.*;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final DriverApplicationRepository driverApplicationRepository;
    private final SupportTicketRepository supportTicketRepository;
    private final ContactMessageRepository contactMessageRepository;

    public StatsService(BookingRepository bookingRepository,
                        CarRepository carRepository,
                        DriverApplicationRepository driverApplicationRepository,
                        SupportTicketRepository supportTicketRepository,
                        ContactMessageRepository contactMessageRepository) {
        this.bookingRepository = bookingRepository;
        this.carRepository = carRepository;
        this.driverApplicationRepository = driverApplicationRepository;
        this.supportTicketRepository = supportTicketRepository;
        this.contactMessageRepository = contactMessageRepository;
    }

    public StatsResponse getStats() {
        long activeBookings = bookingRepository.countActiveAndPending();
        long availableCars = carRepository.countByStatus("available");
        long pendingDrivers = driverApplicationRepository.countByStatus("pending");
        long openTickets = supportTicketRepository.countByStatus("open");

        return new StatsResponse(
            java.util.List.of(
                new StatsResponse.StatItem(1L, "Active Bookings", String.valueOf(activeBookings)),
                new StatsResponse.StatItem(2L, "Available Cars", String.valueOf(availableCars)),
                new StatsResponse.StatItem(3L, "Pending Drivers", String.valueOf(pendingDrivers)),
                new StatsResponse.StatItem(4L, "Support Tickets", String.valueOf(openTickets))
            ),
            new StatsResponse.BookingOverview(
                bookingRepository.countActiveByCity("Johannesburg"),
                bookingRepository.countActiveByCity("Cape Town"),
                bookingRepository.countActiveByCity("Durban")
            )
        );
    }
}
