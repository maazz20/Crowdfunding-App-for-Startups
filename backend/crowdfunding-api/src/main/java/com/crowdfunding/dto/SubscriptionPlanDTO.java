package com.crowdfunding.dto;

import java.math.BigDecimal;

public class SubscriptionPlanDTO {
    private Long id;
    private Integer durationMonths;
    private BigDecimal priceINR;
    private BigDecimal priceUSD;
    private BigDecimal priceEUR;
    private String userType;

    public SubscriptionPlanDTO() {
    }

    public SubscriptionPlanDTO(Long id, Integer durationMonths, BigDecimal priceINR, BigDecimal priceUSD, BigDecimal priceEUR, String userType) {
        this.id = id;
        this.durationMonths = durationMonths;
        this.priceINR = priceINR;
        this.priceUSD = priceUSD;
        this.priceEUR = priceEUR;
        this.userType = userType;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getDurationMonths() {
        return durationMonths;
    }

    public void setDurationMonths(Integer durationMonths) {
        this.durationMonths = durationMonths;
    }

    public BigDecimal getPriceINR() {
        return priceINR;
    }

    public void setPriceINR(BigDecimal priceINR) {
        this.priceINR = priceINR;
    }

    public BigDecimal getPriceUSD() {
        return priceUSD;
    }

    public void setPriceUSD(BigDecimal priceUSD) {
        this.priceUSD = priceUSD;
    }

    public BigDecimal getPriceEUR() {
        return priceEUR;
    }

    public void setPriceEUR(BigDecimal priceEUR) {
        this.priceEUR = priceEUR;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }
}
