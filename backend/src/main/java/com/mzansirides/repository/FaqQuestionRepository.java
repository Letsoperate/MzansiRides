package com.mzansirides.repository;

import com.mzansirides.model.FaqQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FaqQuestionRepository extends JpaRepository<FaqQuestion, Long> {
    List<FaqQuestion> findByStatus(String status);
    long countByStatus(String status);
}
