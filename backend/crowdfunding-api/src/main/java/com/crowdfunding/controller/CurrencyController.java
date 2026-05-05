package com.crowdfunding.controller;

import com.crowdfunding.entity.Currency;
import com.crowdfunding.repository.CurrencyRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/currencies")
public class CurrencyController {
    private final CurrencyRepository currencyRepository;

    public CurrencyController(CurrencyRepository currencyRepository) {
        this.currencyRepository = currencyRepository;
    }

    @GetMapping
    public List<Currency> getAllCurrencies() {
        return currencyRepository.findAll();
    }
}
