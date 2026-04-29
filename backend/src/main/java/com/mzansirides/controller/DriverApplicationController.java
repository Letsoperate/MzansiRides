package com.mzansirides.controller;

import com.mzansirides.dto.StatusUpdateRequest;
import com.mzansirides.model.DriverApplication;
import com.mzansirides.service.DriverApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/drivers")
public class DriverApplicationController {

    private final DriverApplicationService driverApplicationService;

    public DriverApplicationController(DriverApplicationService driverApplicationService) {
        this.driverApplicationService = driverApplicationService;
    }

    @GetMapping
    public List<DriverApplication> getAll() {
        return driverApplicationService.getAllApplications();
    }

    @GetMapping("/pending")
    public List<DriverApplication> getPending() {
        return driverApplicationService.getPendingApplications();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<DriverApplication> updateStatus(@PathVariable Long id,
                                                            @RequestBody StatusUpdateRequest request) {
        try {
            return ResponseEntity.ok(driverApplicationService.updateStatus(id, request.status()));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
