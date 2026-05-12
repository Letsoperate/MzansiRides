package com.mzansirides.service;

import com.mzansirides.model.SupportTicket;
import com.mzansirides.repository.SupportTicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupportTicketService {

    private final SupportTicketRepository supportTicketRepository;

    public SupportTicketService(SupportTicketRepository supportTicketRepository) {
        this.supportTicketRepository = supportTicketRepository;
    }

    public List<SupportTicket> getAllTickets() {
        return supportTicketRepository.findAll();
    }

    public List<SupportTicket> getOpenTickets() {
        return supportTicketRepository.findByStatus("open");
    }

    public SupportTicket createTicket(SupportTicket ticket) {
        return supportTicketRepository.save(ticket);
    }

    public SupportTicket updateStatus(Long id, String status) {
        SupportTicket ticket = supportTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(status);
        return supportTicketRepository.save(ticket);
    }

    public SupportTicket updateTicket(Long id, SupportTicket updated) {
        SupportTicket ticket = supportTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        if (updated.getSubject() != null) ticket.setSubject(updated.getSubject());
        if (updated.getMessage() != null) ticket.setMessage(updated.getMessage());
        if (updated.getCustomerName() != null) ticket.setCustomerName(updated.getCustomerName());
        if (updated.getEmail() != null) ticket.setEmail(updated.getEmail());
        if (updated.getStatus() != null) ticket.setStatus(updated.getStatus());
        return supportTicketRepository.save(ticket);
    }

    public void deleteTicket(Long id) {
        if (!supportTicketRepository.existsById(id)) {
            throw new RuntimeException("Ticket not found");
        }
        supportTicketRepository.deleteById(id);
    }
}
