package com.mzansirides.service;

import com.mzansirides.model.FaqQuestion;
import com.mzansirides.repository.FaqQuestionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FaqQuestionService {

    private final FaqQuestionRepository faqQuestionRepository;

    public FaqQuestionService(FaqQuestionRepository faqQuestionRepository) {
        this.faqQuestionRepository = faqQuestionRepository;
    }

    public List<FaqQuestion> getAll() {
        return faqQuestionRepository.findAll();
    }

    public List<FaqQuestion> getPending() {
        return faqQuestionRepository.findByStatus("pending");
    }

    public long countPending() {
        return faqQuestionRepository.countByStatus("pending");
    }

    public FaqQuestion submit(String email, String question) {
        FaqQuestion fq = new FaqQuestion();
        fq.setEmail(email);
        fq.setQuestion(question);
        fq.setStatus("pending");
        fq.setCreatedAt(LocalDateTime.now());
        return faqQuestionRepository.save(fq);
    }

    public FaqQuestion answerQuestion(Long id, String answer) {
        FaqQuestion fq = faqQuestionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ question not found"));
        fq.setAnswer(answer);
        fq.setStatus("answered");
        fq.setAnsweredAt(LocalDateTime.now());
        return faqQuestionRepository.save(fq);
    }

    public void deleteById(Long id) {
        faqQuestionRepository.deleteById(id);
    }
}
