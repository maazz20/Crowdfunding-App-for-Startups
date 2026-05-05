package com.crowdfunding.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscription_plans")
public class SubscriptionPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer durationMonths; // 3, 6, or 12

    @Column(name = "priceinr", nullable = false)
    private BigDecimal priceINR;

    @Column(name = "priceusd", nullable = false)
    private BigDecimal priceUSD;

    @Column(name = "priceeur", nullable = false)
    private BigDecimal priceEUR;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_type_id", nullable = false)
    private UserType userType; // STARTUP or INVESTOR

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public SubscriptionPlan() {
    }

    public SubscriptionPlan(Integer durationMonths, BigDecimal priceINR, BigDecimal priceUSD, BigDecimal priceEUR, UserType userType) {
        this.durationMonths = durationMonths;
        this.priceINR = priceINR;
        this.priceUSD = priceUSD;
        this.priceEUR = priceEUR;
        this.userType = userType;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
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

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
