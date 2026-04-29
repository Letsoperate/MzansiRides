package com.mzansirides.repository;

import com.mzansirides.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    long countByReadFalse();
}
