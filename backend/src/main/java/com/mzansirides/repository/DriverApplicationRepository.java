package com.mzansirides.repository;

import com.mzansirides.model.DriverApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DriverApplicationRepository extends JpaRepository<DriverApplication, Long> {
    List<DriverApplication> findByStatus(String status);
    long countByStatus(String status);
}
