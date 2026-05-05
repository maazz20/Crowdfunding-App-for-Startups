package com.crowdfunding.repository;

import com.crowdfunding.entity.Campaign;
import com.crowdfunding.entity.CampaignStatus;
import com.crowdfunding.entity.Category;
import com.crowdfunding.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByCreator(User creator);

    List<Campaign> findByCategory(Category category);

    List<Campaign> findByStatus(CampaignStatus status);
}
