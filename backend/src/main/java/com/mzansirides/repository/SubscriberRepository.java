package com.mzansirides.repository;

import com.mzansirides.model.Subscriber;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SubscriberRepository extends JpaRepository<Subscriber, Long> {
    Optional<Subscriber> findByEmail(String email);
    Optional<Subscriber> findByUnsubscribeToken(String token);
    List<Subscriber> findBySubscribedTrue();
    long countBySubscribedTrue();
}
