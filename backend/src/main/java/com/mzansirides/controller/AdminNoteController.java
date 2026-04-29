package com.mzansirides.controller;

import com.mzansirides.dto.NoteRequest;
import com.mzansirides.service.AdminNoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/notes")
public class AdminNoteController {

    private final AdminNoteService adminNoteService;

    public AdminNoteController(AdminNoteService adminNoteService) {
        this.adminNoteService = adminNoteService;
    }

    @GetMapping("/latest")
    public Map<String, Object> getLatestNote() {
        return adminNoteService.getLatestNote();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> saveNote(@RequestBody NoteRequest request) {
        if (request.noteText() == null || request.noteText().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Note text is required"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(adminNoteService.saveNote(request.noteText()));
    }
}
