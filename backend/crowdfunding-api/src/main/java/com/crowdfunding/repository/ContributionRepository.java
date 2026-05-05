package com.crowdfunding.repository;

import com.crowdfunding.entity.Campaign;
import com.crowdfunding.entity.Contribution;
import com.crowdfunding.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ContributionRepository extends JpaRepository<Contribution, Long> {
    List<Contribution> findByContributor(User contributor);

    List<Contribution> findByCampaign(Campaign campaign);

    @Query("SELECT SUM(c.amount) FROM Contribution c WHERE c.campaign = ?1")
    BigDecimal sumAmountByCampaign(Campaign campaign);

    java.util.Optional<Contribution> findByRazorpayOrderId(String razorpayOrderId);
}
