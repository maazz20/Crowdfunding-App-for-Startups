package com.crowdfunding.service;

import com.crowdfunding.entity.Campaign;
import com.crowdfunding.entity.CampaignStatus;
import com.crowdfunding.entity.User;
import com.crowdfunding.repository.CampaignRepository;
import com.crowdfunding.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CampaignService {
    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;
    
    @Autowired
    private SubscriptionService subscriptionService;

    public CampaignService(CampaignRepository campaignRepository, UserRepository userRepository) {
        this.campaignRepository = campaignRepository;
        this.userRepository = userRepository;
    }

    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll();
    }

    /**
     * Get all active campaigns (either newly created or with active subscription)
     */
    public List<Campaign> getActiveCampaigns() {
        return campaignRepository.findByStatus(CampaignStatus.ACTIVE).stream()
                .filter(this::isCampaignStillListed)
                .collect(Collectors.toList());
    }

    /**
     * Check if campaign should still be listed
     * - Free for 7 days from creation
     * - After 7 days, requires creator to have active subscription
     */
    private boolean isCampaignStillListed(Campaign campaign) {
        LocalDate today = LocalDate.now();
        long daysPassed = ChronoUnit.DAYS.between(campaign.getCreatedAt().toLocalDate(), today);

        if (daysPassed <= 7) {
            return true; // Free period, always listed
        }

        // After 7 days, check if creator has subscription
        return subscriptionService.hasActiveSubscription(campaign.getCreator().getId());
    }

    public Campaign getCampaignById(Long id) {
        return campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
    }

    public Campaign createCampaign(Campaign campaign) {
        campaign.setStatus(CampaignStatus.PENDING);
        return campaignRepository.save(campaign);
    }

    public Campaign approveCampaign(Long id) {
        Campaign campaign = getCampaignById(id);
        campaign.setStatus(CampaignStatus.ACTIVE);
        return campaignRepository.save(campaign);
    }

    public List<Campaign> getCampaignsByStatus(CampaignStatus status) {
        return campaignRepository.findByStatus(status);
    }

    public Campaign updateCampaign(Long id, Campaign campaignDetails) {
        Campaign campaign = getCampaignById(id);
        campaign.setTitle(campaignDetails.getTitle());
        campaign.setDescription(campaignDetails.getDescription());
        campaign.setTargetAmount(campaignDetails.getTargetAmount());
        campaign.setEndDate(campaignDetails.getEndDate());
        return campaignRepository.save(campaign);
    }

    public void deleteCampaign(Long id) {
        campaignRepository.deleteById(id);
    }

    public List<Campaign> getCampaignsByCreator(Long creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return campaignRepository.findByCreator(creator);
    }

    /**
     * Check if campaign will be listed after 7 days
     * Returns true if creator has subscription or campaign hasn't reached 7 days yet
     */
    public boolean willCampaignBeListed(Long campaignId) {
        Campaign campaign = getCampaignById(campaignId);
        return isCampaignStillListed(campaign);
    }
}
