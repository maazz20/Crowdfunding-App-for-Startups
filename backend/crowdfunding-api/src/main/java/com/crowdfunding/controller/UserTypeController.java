package com.crowdfunding.controller;

import com.crowdfunding.entity.UserType;
import com.crowdfunding.repository.UserTypeRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/user-types")
public class UserTypeController {
    private final UserTypeRepository userTypeRepository;

    public UserTypeController(UserTypeRepository userTypeRepository) {
        this.userTypeRepository = userTypeRepository;
    }

    @GetMapping
    public List<UserType> getAllUserTypes() {
        return userTypeRepository.findAll().stream()
                .filter(userType -> !"ADMIN".equals(userType.getTypeName()))
                .toList();
    }
}
