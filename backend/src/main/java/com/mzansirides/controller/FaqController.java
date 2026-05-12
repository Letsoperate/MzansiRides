package com.mzansirides.controller;

import com.mzansirides.model.FaqQuestion;
import com.mzansirides.service.FaqQuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/faqs")
public class FaqController {

    private final FaqQuestionService faqQuestionService;

    public FaqController(FaqQuestionService faqQuestionService) {
        this.faqQuestionService = faqQuestionService;
    }

    @GetMapping
    public List<FaqQuestion> getAll() {
        return faqQuestionService.getAll();
    }

    @GetMapping("/pending")
    public List<FaqQuestion> getPending() {
        return faqQuestionService.getPending();
    }

    @PutMapping("/{id}/answer")
    public ResponseEntity<FaqQuestion> answerQuestion(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(faqQuestionService.answerQuestion(id, body.get("answer")));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        try {
            faqQuestionService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
