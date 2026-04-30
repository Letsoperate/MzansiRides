package com.mzansirides.service;

import com.mzansirides.model.DriverApplication;
import com.mzansirides.repository.DriverApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DriverApplicationService {

    private final DriverApplicationRepository driverApplicationRepository;

    public DriverApplicationService(DriverApplicationRepository driverApplicationRepository) {
        this.driverApplicationRepository = driverApplicationRepository;
    }

    public List<DriverApplication> getAllApplications() {
        return driverApplicationRepository.findAll();
    }

    public List<DriverApplication> getPendingApplications() {
        return driverApplicationRepository.findByStatus("pending");
    }

    public DriverApplication createApplication(DriverApplication app) {
        return driverApplicationRepository.save(app);
    }

    public DriverApplication updateStatus(Long id, String status) {
        DriverApplication app = driverApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(status);
        return driverApplicationRepository.save(app);
    }

    public DriverApplication updateFields(Long id, Map<String, String> fields) {
        DriverApplication app = driverApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        if (fields.containsKey("licenseDoc")) app.setLicenseDoc(fields.get("licenseDoc"));
        if (fields.containsKey("passportDoc")) app.setPassportDoc(fields.get("passportDoc"));
        return driverApplicationRepository.save(app);
    }
}
