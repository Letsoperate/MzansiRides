package com.mzansirides.repository;

import com.mzansirides.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByStatus(String status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status IN ('active', 'pending')")
    long countActiveAndPending();

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.city = ?1 AND b.status <> 'completed'")
    long countActiveByCity(String city);
}
