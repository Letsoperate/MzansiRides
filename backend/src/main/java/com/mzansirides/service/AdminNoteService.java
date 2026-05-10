package com.mzansirides.service;

import com.mzansirides.model.AdminNote;
import com.mzansirides.repository.AdminNoteRepository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class AdminNoteService {

    private final AdminNoteRepository adminNoteRepository;

    public AdminNoteService(AdminNoteRepository adminNoteRepository) {
        this.adminNoteRepository = adminNoteRepository;
    }

    public Map<String, Object> getLatestNote() {
        Optional<AdminNote> latest = adminNoteRepository.findTopByOrderByIdDesc();
        if (latest.isPresent()) {
            AdminNote n = latest.get();
            return Map.of("note", Map.of(
                "id", n.getId(),
                "noteText", n.getNoteText(),
                "createdAt", n.getCreatedAt().toString()
            ));
        }
        return Map.of("note", "No notes yet");
    }

    public Map<String, Object> saveNote(String noteText) {
        AdminNote note = new AdminNote(noteText.trim());
        note = adminNoteRepository.save(note);
        return Map.of("note", Map.of(
            "id", note.getId(),
            "noteText", note.getNoteText(),
            "createdAt", note.getCreatedAt().toString()
        ));
    }
}
