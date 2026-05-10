package com.mzansirides.repository;

import com.mzansirides.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByStatus(String status);
    List<Car> findByCategory(String category);

    @Query("SELECT c FROM Car c ORDER BY CASE c.category " +
           "WHEN 'SUV' THEN 1 WHEN 'Hatchback' THEN 2 WHEN 'Sedan' THEN 3 " +
           "WHEN 'Utility' THEN 4 WHEN 'Luxury' THEN 5 WHEN 'Sport' THEN 6 ELSE 7 END, c.name")
    List<Car> findAllSorted();

    @Query("SELECT c FROM Car c WHERE c.category = ?1 ORDER BY c.name")
    List<Car> findByCategorySorted(String category);

    long countByStatus(String status);
}
