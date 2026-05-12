package com.mzansirides.controller;

import com.mzansirides.dto.StatusUpdateRequest;
import com.mzansirides.model.SupportTicket;
import com.mzansirides.service.SupportTicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tickets")
public class SupportTicketController {

    private final SupportTicketService supportTicketService;

    public SupportTicketController(SupportTicketService supportTicketService) {
        this.supportTicketService = supportTicketService;
    }

    @GetMapping
    public List<SupportTicket> getAll() {
        return supportTicketService.getAllTickets();
    }

    @GetMapping("/open")
    public List<SupportTicket> getOpen() {
        return supportTicketService.getOpenTickets();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<SupportTicket> updateStatus(@PathVariable Long id,
                                                        @RequestBody StatusUpdateRequest request) {
        try {
            return ResponseEntity.ok(supportTicketService.updateStatus(id, request.status()));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupportTicket> updateTicket(@PathVariable Long id,
                                                       @RequestBody SupportTicket updated) {
        try {
            return ResponseEntity.ok(supportTicketService.updateTicket(id, updated));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        try {
            supportTicketService.deleteTicket(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
