package com.crowdfunding.service;

import com.crowdfunding.dto.SubscriptionPaymentRequest;
import com.crowdfunding.dto.SubscriptionPlanDTO;
import com.crowdfunding.dto.UserSubscriptionDTO;
import com.crowdfunding.entity.*;
import com.crowdfunding.repository.SubscriptionPlanRepository;
import com.crowdfunding.repository.UserRepository;
import com.crowdfunding.repository.UserSubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {
    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;

    @Autowired
    private UserSubscriptionRepository userSubscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all subscription plans for a specific user type
     */
    public List<SubscriptionPlanDTO> getSubscriptionPlans(String userTypeString) {
        try {
            // Query by user type name (STARTUP or INVESTOR)
            return subscriptionPlanRepository.findAll().stream()
                    .filter(plan -> plan.getUserType() != null && plan.getUserType().getTypeName().equalsIgnoreCase(userTypeString))
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Invalid user type: " + userTypeString);
        }
    }

    /**
     * Get active subscription for a user
     */
    public UserSubscriptionDTO getActiveSubscription(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userSubscriptionRepository
                .findByUserAndIsActiveTrueAndEndDateGreaterThanEqual(user, LocalDate.now())
                .map(this::convertToDTO)
                .orElse(null);
    }

    /**
     * Check if user has active subscription
     */
    public boolean hasActiveSubscription(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userSubscriptionRepository
                .findByUserAndIsActiveTrueAndEndDateGreaterThanEqual(user, LocalDate.now())
                .isPresent();
    }

    /**
     * Create new subscription after payment
     */
    public UserSubscriptionDTO createSubscription(Long userId, SubscriptionPaymentRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SubscriptionPlan plan = subscriptionPlanRepository.findById(request.getSubscriptionPlanId())
                .orElseThrow(() -> new RuntimeException("Subscription plan not found"));

        // Deactivate any existing active subscription
        userSubscriptionRepository.findByUserAndIsActiveTrueAndEndDateGreaterThanEqual(user, LocalDate.now())
                .ifPresent(sub -> {
                    sub.setIsActive(false);
                    userSubscriptionRepository.save(sub);
                });

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plus(plan.getDurationMonths(), ChronoUnit.MONTHS);

        UserSubscription subscription = new UserSubscription(user, plan, startDate, endDate, request.getRazorpayPaymentId());
        UserSubscription saved = userSubscriptionRepository.save(subscription);

        return convertToDTO(saved);
    }

    /**
     * Check if user can create campaign (Startups)
     * - Can create for free with initial campaign
     * - Need subscription to keep campaign listed for more than 7 days
     */
    public boolean canCreateCampaign(Long userId) {
        // Any user can create a campaign initially
        return true;
    }

    /**
     * Check if campaign needs subscription to keep listed
     * - Campaigns are free for first 7 days
     * - After 7 days, need active subscription to keep listed
     */
    public boolean needsSubscriptionForCampaign(Long userId, LocalDate campaignStartDate) {
        LocalDate today = LocalDate.now();
        long daysPassed = ChronoUnit.DAYS.between(campaignStartDate, today);

        if (daysPassed <= 7) {
            return false; // Free period
        }

        // After 7 days, check for active subscription
        return hasActiveSubscription(userId);
    }

    /**
     * Check if investor can invest in campaign
     * - Can invest in 1 campaign for free
     * - Need subscription to invest in more than 1 campaign
     */
    public boolean canInvestInCampaign(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if this is first investment
        // This logic will be implemented in ContributionService
        return true;
    }

    /**
     * Check if investor needs subscription for additional investments
     */
    public boolean needsSubscriptionForInvestment(Long userId, int investmentCount) {
        if (investmentCount <= 1) {
            return false; // Free for first investment
        }

        // Need subscription for additional investments
        return hasActiveSubscription(userId);
    }

    /**
     * Convert entity to DTO
     */
    private SubscriptionPlanDTO convertToDTO(SubscriptionPlan plan) {
        return new SubscriptionPlanDTO(
                plan.getId(),
                plan.getDurationMonths(),
                plan.getPriceINR(),
                plan.getPriceUSD(),
                plan.getPriceEUR(),
                plan.getUserType().getTypeName()
        );
    }

    private UserSubscriptionDTO convertToDTO(UserSubscription subscription) {
        return new UserSubscriptionDTO(
                subscription.getId(),
                subscription.getUser().getId(),
                subscription.getSubscriptionPlan().getId(),
                subscription.getStartDate(),
                subscription.getEndDate(),
                subscription.getIsActive(),
                subscription.getRazorpayPaymentId()
        );
    }
}
