package com.crowdfunding.controller;

import com.crowdfunding.entity.Campaign;
import com.crowdfunding.entity.CampaignStatus;
import com.crowdfunding.service.CampaignService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/campaigns")
public class CampaignController {
    private final CampaignService campaignService;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @GetMapping
    public ResponseEntity<List<Campaign>> getAllCampaigns(Authentication authentication) {
        if (authentication == null) {
            // Return only ACTIVE campaigns for unauthenticated users
            return ResponseEntity.ok(campaignService.getCampaignsByStatus(CampaignStatus.ACTIVE));
        }

        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(auth -> auth.getAuthority())
                .orElse("");

        if (role.equals("ROLE_ADMIN")) {
            // Admin sees all campaigns
            return ResponseEntity.ok(campaignService.getAllCampaigns());
        } else if (role.equals("ROLE_INVESTOR")) {
            // Investors see only ACTIVE campaigns
            return ResponseEntity.ok(campaignService.getCampaignsByStatus(CampaignStatus.ACTIVE));
        } else {
            // For STARTUP and others, show only ACTIVE campaigns in list view
            return ResponseEntity.ok(campaignService.getCampaignsByStatus(CampaignStatus.ACTIVE));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campaign> getCampaignById(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.getCampaignById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('STARTUP', 'ADMIN')")
    public ResponseEntity<Campaign> createCampaign(@RequestBody Campaign campaign) {
        return ResponseEntity.status(201).body(campaignService.createCampaign(campaign));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STARTUP', 'ADMIN')")
    public ResponseEntity<Campaign> updateCampaign(@PathVariable Long id, @RequestBody Campaign campaign) {
        return ResponseEntity.ok(campaignService.updateCampaign(id, campaign));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<Campaign>> getCampaignsByCreator(@PathVariable Long creatorId) {
        return ResponseEntity.ok(campaignService.getCampaignsByCreator(creatorId));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Campaign> approveCampaign(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.approveCampaign(id));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Campaign>> getPendingCampaigns() {
        return ResponseEntity.ok(campaignService.getCampaignsByStatus(CampaignStatus.PENDING));
    }
}
