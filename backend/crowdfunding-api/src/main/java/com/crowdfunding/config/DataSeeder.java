package com.crowdfunding.config;

import com.crowdfunding.entity.Category;
import com.crowdfunding.entity.User;
import com.crowdfunding.entity.UserType;
import com.crowdfunding.entity.Currency;
import com.crowdfunding.entity.SubscriptionPlan;
import com.crowdfunding.repository.CategoryRepository;
import com.crowdfunding.repository.CurrencyRepository;
import com.crowdfunding.repository.UserRepository;
import com.crowdfunding.repository.UserTypeRepository;
import com.crowdfunding.repository.SubscriptionPlanRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.math.BigDecimal;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserTypeRepository userTypeRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final CurrencyRepository currencyRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public DataSeeder(UserTypeRepository userTypeRepository, CategoryRepository categoryRepository,
            UserRepository userRepository, CurrencyRepository currencyRepository,
            SubscriptionPlanRepository subscriptionPlanRepository,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userTypeRepository = userTypeRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.currencyRepository = currencyRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userTypeRepository.count() == 0) {
            UserType investor = new UserType();
            investor.setTypeName("INVESTOR");
            userTypeRepository.save(investor);

            UserType startup = new UserType();
            startup.setTypeName("STARTUP");
            userTypeRepository.save(startup);

            UserType admin = new UserType();
            admin.setTypeName("ADMIN");
            userTypeRepository.save(admin);
        }

        if (currencyRepository.count() == 0) {
            currencyRepository.save(new Currency(null, "USD", "US Dollar", "$"));
            currencyRepository.save(new Currency(null, "INR", "Indian Rupee", "₹"));
            currencyRepository.save(new Currency(null, "EUR", "Euro", "€"));
        }

        if (categoryRepository.count() == 0) {
            categoryRepository.save(new Category(null, "Technology", "Tech startups and apps"));
            categoryRepository.save(new Category(null, "Health", "Healthcare and wellness"));
            categoryRepository.save(new Category(null, "Education", "EdTech solutions"));
        }

        if (userRepository.count() == 0) {
            UserType investorType = userTypeRepository.findByTypeName("INVESTOR").orElseThrow();

            User user = new User();
            user.setName("John Investor");
            user.setEmail("investor@example.com");
            user.setPassword(passwordEncoder.encode("password123"));
            user.setUserType(investorType);
            user.setCreatedAt(LocalDateTime.now());

            userRepository.save(user);

            UserType adminType = userTypeRepository.findByTypeName("ADMIN").orElseThrow();
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("pw-12345"));
            admin.setUserType(adminType);
            admin.setCreatedAt(LocalDateTime.now());
            userRepository.save(admin);
        }

        if (subscriptionPlanRepository.count() == 0) {
            // Get user types
            UserType investorType = userTypeRepository.findByTypeName("INVESTOR").orElseThrow();
            UserType startupType = userTypeRepository.findByTypeName("STARTUP").orElseThrow();

            // Investor plans
            subscriptionPlanRepository.save(createSubscriptionPlan(investorType, 3, 
                new BigDecimal("299"), new BigDecimal("3.59"), new BigDecimal("3.39")));
            subscriptionPlanRepository.save(createSubscriptionPlan(investorType, 6, 
                new BigDecimal("499"), new BigDecimal("5.99"), new BigDecimal("5.65")));
            subscriptionPlanRepository.save(createSubscriptionPlan(investorType, 12, 
                new BigDecimal("999"), new BigDecimal("11.99"), new BigDecimal("11.34")));

            // Startup plans
            subscriptionPlanRepository.save(createSubscriptionPlan(startupType, 3, 
                new BigDecimal("299"), new BigDecimal("3.59"), new BigDecimal("3.39")));
            subscriptionPlanRepository.save(createSubscriptionPlan(startupType, 6, 
                new BigDecimal("499"), new BigDecimal("5.99"), new BigDecimal("5.65")));
            subscriptionPlanRepository.save(createSubscriptionPlan(startupType, 12, 
                new BigDecimal("999"), new BigDecimal("11.99"), new BigDecimal("11.34")));
        }

        System.out.println("Data seeding completed.");
    }

    private SubscriptionPlan createSubscriptionPlan(UserType userType, Integer durationMonths, 
            BigDecimal priceINR, BigDecimal priceUSD, BigDecimal priceEUR) {
        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setUserType(userType);
        plan.setDurationMonths(durationMonths);
        plan.setPriceINR(priceINR);
        plan.setPriceUSD(priceUSD);
        plan.setPriceEUR(priceEUR);
        plan.setCreatedAt(LocalDateTime.now());
        return plan;
    }
}
