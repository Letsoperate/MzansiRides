package com.mzansirides.repository;

import com.mzansirides.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByStatus(String status);
    List<Car> findByCategory(String category);
    long countByStatus(String status);
}
