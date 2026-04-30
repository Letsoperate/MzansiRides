package com.mzansirides.repository;

import com.mzansirides.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByStatus(String status);
    Optional<Booking> findByBookingToken(String token);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status IN ('active','pending_approval','approved')")
    long countActiveAndPending();

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.city = ?1 AND b.status <> 'completed' AND b.status <> 'rejected'")
    long countActiveByCity(String city);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.paymentStatus = 'PAID'")
    long countPaid();
}
