package com.crowdfunding.service;

import com.crowdfunding.entity.Campaign;
import com.crowdfunding.entity.Contribution;
import com.crowdfunding.entity.ContributionStatus;
import com.crowdfunding.entity.User;
import com.crowdfunding.repository.CampaignRepository;
import com.crowdfunding.repository.ContributionRepository;
import com.crowdfunding.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.crowdfunding.service.PaymentService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContributionService {
    private final ContributionRepository contributionRepository;
    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;

    private final PaymentService paymentService;
    
    @Autowired
    private SubscriptionService subscriptionService;

    public ContributionService(ContributionRepository contributionRepository, CampaignRepository campaignRepository,
            UserRepository userRepository, PaymentService paymentService) {
        this.contributionRepository = contributionRepository;
        this.campaignRepository = campaignRepository;
        this.userRepository = userRepository;
        this.paymentService = paymentService;
    }

    /**
     * Check if investor can make a contribution
     * - Free for first investment in any campaign
     * - Needs subscription for investments in 2+ campaigns
     */
    public boolean canInvest(Long investorId) {
        User investor = userRepository.findById(investorId)
                .orElseThrow(() -> new RuntimeException("Investor not found"));

        // Count how many campaigns this investor has contributed to
        List<Contribution> contributions = contributionRepository.findByContributor(investor);
        int campaignsContributedTo = (int) contributions.stream()
                .filter(c -> c.getStatus() == ContributionStatus.COMPLETED)
                .map(c -> c.getCampaign().getId())
                .distinct()
                .count();

        // Free for first campaign, needs subscription for 2+
        if (campaignsContributedTo >= 1) {
            return subscriptionService.hasActiveSubscription(investorId);
        }

        return true; // First investment is free
    }

    /**
     * Check if investor needs subscription for this investment
     */
    public boolean needsSubscriptionForThisInvestment(Long investorId) {
        User investor = userRepository.findById(investorId)
                .orElseThrow(() -> new RuntimeException("Investor not found"));

        List<Contribution> contributions = contributionRepository.findByContributor(investor);
        int campaignsContributedTo = (int) contributions.stream()
                .filter(c -> c.getStatus() == ContributionStatus.COMPLETED)
                .map(c -> c.getCampaign().getId())
                .distinct()
                .count();

        // Need subscription for 2+ campaigns (first is free)
        return campaignsContributedTo >= 1;
    }

    public Contribution createContribution(Contribution contribution) {
        try {
            // Check if investor can invest
            if (!canInvest(contribution.getContributor().getId())) {
                throw new RuntimeException("You need an active subscription to invest in more campaigns. Free investment limited to 1 campaign.");
            }

            // Create Razorpay Order
            com.razorpay.Order order = paymentService.createOrder(contribution.getAmount(),
                    "receipt_" + System.currentTimeMillis());

            contribution.setRazorpayOrderId(order.get("id"));
            contribution.setStatus(ContributionStatus.PENDING);
            contribution.setContributedAt(LocalDateTime.now());

            return contributionRepository.save(contribution);
        } catch (Exception e) {
            throw new RuntimeException("Error creating Razorpay order", e);
        }
    }

    public Contribution verifyContribution(String orderId, String paymentId, String signature) {
        boolean isValid = paymentService.verifyPaymentSignature(orderId, paymentId, signature);

        if (!isValid) {
            throw new RuntimeException("Invalid payment signature");
        }

        Contribution contribution = contributionRepository.findByRazorpayOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Contribution not found for order: " + orderId));

        contribution.setRazorpayPaymentId(paymentId);
        contribution.setStatus(ContributionStatus.COMPLETED);

        Contribution saved = contributionRepository.save(contribution);

        // Update campaign current amount
        Long campaignId = saved.getCampaign().getId();
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        BigDecimal totalContributions = contributionRepository
                .findByCampaign(campaign).stream()
                .filter(c -> c.getStatus() == ContributionStatus.COMPLETED)
                .map(Contribution::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        campaign.setCurrentAmount(totalContributions);
        campaignRepository.save(campaign);

        return saved;
    }

    public List<Contribution> getUserContributions(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return contributionRepository.findByContributor(user);
    }

    public List<Contribution> getCampaignContributions(Long campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
        return contributionRepository.findByCampaign(campaign);
    }
}
