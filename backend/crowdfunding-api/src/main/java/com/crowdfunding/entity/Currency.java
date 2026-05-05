package com.crowdfunding.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "currencies")
public class Currency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code; // USD, INR, EUR

    @Column(nullable = false)
    private String name; // US Dollar, Indian Rupee, Euro

    @Column(nullable = false)
    private String symbol; // $, ₹, €

    public Currency() {
    }

    public Currency(Long id, String code, String name, String symbol) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.symbol = symbol;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }
}
