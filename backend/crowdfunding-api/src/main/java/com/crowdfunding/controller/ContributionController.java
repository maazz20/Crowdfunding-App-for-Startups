package com.crowdfunding.controller;

import com.crowdfunding.entity.Contribution;
import com.crowdfunding.service.ContributionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contributions")
public class ContributionController {
    private final ContributionService contributionService;

    public ContributionController(ContributionService contributionService) {
        this.contributionService = contributionService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('INVESTOR', 'ADMIN')")
    public ResponseEntity<Contribution> createContribution(@RequestBody Contribution contribution) {
        return ResponseEntity.status(201).body(contributionService.createContribution(contribution));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody java.util.Map<String, String> data) {
        try {
            Contribution contribution = contributionService.verifyContribution(
                    data.get("razorpay_order_id"),
                    data.get("razorpay_payment_id"),
                    data.get("razorpay_signature"));
            return ResponseEntity.ok(contribution);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Contribution>> getUserContributions(@PathVariable Long userId) {
        return ResponseEntity.ok(contributionService.getUserContributions(userId));
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<Contribution>> getCampaignContributions(@PathVariable Long campaignId) {
        return ResponseEntity.ok(contributionService.getCampaignContributions(campaignId));
    }
}
