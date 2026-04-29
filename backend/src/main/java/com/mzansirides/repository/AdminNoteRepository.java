package com.mzansirides.repository;

import com.mzansirides.model.AdminNote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminNoteRepository extends JpaRepository<AdminNote, Long> {
    Optional<AdminNote> findTopByOrderByIdDesc();
}
