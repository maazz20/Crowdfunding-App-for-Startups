package com.crowdfunding.dto;

import java.time.LocalDate;

public class UserSubscriptionDTO {
    private Long id;
    private Long userId;
    private Long subscriptionPlanId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive;
    private String razorpayPaymentId;

    public UserSubscriptionDTO() {
    }

    public UserSubscriptionDTO(Long id, Long userId, Long subscriptionPlanId, LocalDate startDate, LocalDate endDate, Boolean isActive, String razorpayPaymentId) {
        this.id = id;
        this.userId = userId;
        this.subscriptionPlanId = subscriptionPlanId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isActive = isActive;
        this.razorpayPaymentId = razorpayPaymentId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getSubscriptionPlanId() {
        return subscriptionPlanId;
    }

    public void setSubscriptionPlanId(Long subscriptionPlanId) {
        this.subscriptionPlanId = subscriptionPlanId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }
}
