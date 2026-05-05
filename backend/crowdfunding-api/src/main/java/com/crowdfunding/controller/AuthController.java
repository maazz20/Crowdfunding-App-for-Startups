package com.crowdfunding.controller;

import com.crowdfunding.dto.JwtResponse;
import com.crowdfunding.dto.LoginRequest;
import com.crowdfunding.dto.RegistrationRequest;
import com.crowdfunding.entity.User;
import com.crowdfunding.entity.UserType;
import com.crowdfunding.repository.UserRepository;
import com.crowdfunding.repository.UserTypeRepository;
import com.crowdfunding.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserTypeRepository userTypeRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
            UserTypeRepository userTypeRepository, PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.userTypeRepository = userTypeRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
        
        return ResponseEntity.ok(new JwtResponse(jwt, 
                                 user.getId(), 
                                 user.getName(), 
                                 user.getEmail(), 
                                 user.getUserType().getTypeName()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegistrationRequest signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Email is already in use!");
        }

        // Create new user's account
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        UserType userType = userTypeRepository.findById(signUpRequest.getUserTypeId())
                .orElseThrow(() -> new RuntimeException("Error: User Type is not found."));
        user.setUserType(userType);

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}
