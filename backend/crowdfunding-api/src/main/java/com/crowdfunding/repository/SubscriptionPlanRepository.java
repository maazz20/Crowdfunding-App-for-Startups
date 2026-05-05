package com.crowdfunding.repository;

import com.crowdfunding.entity.SubscriptionPlan;
import com.crowdfunding.entity.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {
    List<SubscriptionPlan> findByUserType(UserType userType);
    
    SubscriptionPlan findByUserTypeAndDurationMonths(UserType userType, Integer durationMonths);
}
