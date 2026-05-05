package com.crowdfunding.controller;

import com.crowdfunding.dto.SubscriptionPaymentRequest;
import com.crowdfunding.dto.SubscriptionPlanDTO;
import com.crowdfunding.dto.UserSubscriptionDTO;
import com.crowdfunding.entity.User;
import com.crowdfunding.repository.UserRepository;
import com.crowdfunding.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/subscriptions")
public class SubscriptionController {
    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get subscription plans for a user type
     * Query param: userType (STARTUP or INVESTOR)
     */
    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlanDTO>> getSubscriptionPlans(
            @RequestParam String userType) {
        List<SubscriptionPlanDTO> plans = subscriptionService.getSubscriptionPlans(userType);
        return ResponseEntity.ok(plans);
    }

    /**
     * Get current user's active subscription
     */
    @GetMapping("/active")
    public ResponseEntity<?> getActiveSubscription() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        
        // Extract user ID from authentication (you may need to adjust this based on your security setup)
        Long userId = extractUserIdFromAuth(auth);
        
        UserSubscriptionDTO subscription = subscriptionService.getActiveSubscription(userId);
        if (subscription == null) {
            return ResponseEntity.ok(new HashMap<String, String>() {{
                put("message", "No active subscription");
            }});
        }
        return ResponseEntity.ok(subscription);
    }

    /**
     * Check if user has active subscription
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkSubscription() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = extractUserIdFromAuth(auth);
        
        boolean hasSubscription = subscriptionService.hasActiveSubscription(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("hasSubscription", hasSubscription);
        return ResponseEntity.ok(response);
    }

    /**
     * Create subscription after payment
     */
    @PostMapping("/create")
    public ResponseEntity<?> createSubscription(@RequestBody SubscriptionPaymentRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long userId = extractUserIdFromAuth(auth);
            
            UserSubscriptionDTO subscription = subscriptionService.createSubscription(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(subscription);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Check if user can create campaign
     */
    @GetMapping("/can-create-campaign")
    public ResponseEntity<Map<String, Object>> canCreateCampaign() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = extractUserIdFromAuth(auth);
        
        boolean canCreate = subscriptionService.canCreateCampaign(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("canCreateCampaign", canCreate);
        return ResponseEntity.ok(response);
    }

    /**
     * Check if user can invest
     */
    @GetMapping("/can-invest")
    public ResponseEntity<Map<String, Object>> canInvest() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = extractUserIdFromAuth(auth);
        
        boolean canInvest = subscriptionService.canInvestInCampaign(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("canInvest", canInvest);
        return ResponseEntity.ok(response);
    }

    /**
     * Extract user ID from authentication
     * This method extracts the email from the JWT token and looks up the user
     */
    private Long extractUserIdFromAuth(Authentication auth) {
        Object principal = auth.getPrincipal();
        
        if (principal instanceof String) {
            String email = (String) principal;
            return userRepository.findByEmail(email)
                    .map(User::getId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
        }
        
        throw new RuntimeException("Unable to extract user from authentication");
    }
}
