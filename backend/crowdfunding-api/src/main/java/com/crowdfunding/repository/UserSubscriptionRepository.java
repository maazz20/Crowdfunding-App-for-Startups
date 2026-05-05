package com.crowdfunding.repository;

import com.crowdfunding.entity.User;
import com.crowdfunding.entity.UserSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
    List<UserSubscription> findByUser(User user);
    
    Optional<UserSubscription> findActiveSubscriptionByUser(User user);
    
    List<UserSubscription> findByUserAndIsActiveTrue(User user);
    
    Optional<UserSubscription> findByUserAndIsActiveTrueAndEndDateGreaterThanEqual(User user, LocalDate date);
}
