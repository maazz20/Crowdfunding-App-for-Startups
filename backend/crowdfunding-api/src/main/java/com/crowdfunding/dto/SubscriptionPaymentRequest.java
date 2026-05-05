package com.crowdfunding.dto;

public class SubscriptionPaymentRequest {
    private Long subscriptionPlanId;
    private String razorpayPaymentId;

    public SubscriptionPaymentRequest() {
    }

    public SubscriptionPaymentRequest(Long subscriptionPlanId, String razorpayPaymentId) {
        this.subscriptionPlanId = subscriptionPlanId;
        this.razorpayPaymentId = razorpayPaymentId;
    }

    // Getters and Setters
    public Long getSubscriptionPlanId() {
        return subscriptionPlanId;
    }

    public void setSubscriptionPlanId(Long subscriptionPlanId) {
        this.subscriptionPlanId = subscriptionPlanId;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }
}
