package com.vhh.ptit_reviews.controller;

import com.vhh.ptit_reviews.config.JwtService;
import com.vhh.ptit_reviews.domain.model.Token;
import com.vhh.ptit_reviews.domain.model.User;
import com.vhh.ptit_reviews.domain.model.UserRole;
import com.vhh.ptit_reviews.domain.request.LoginRequest;
import com.vhh.ptit_reviews.domain.request.RegisterRequest;
import com.vhh.ptit_reviews.domain.response.ApiResponse;
import com.vhh.ptit_reviews.domain.response.AuthResponse;
import com.vhh.ptit_reviews.repository.UserRepository;
import com.vhh.ptit_reviews.service.UserService;
import com.vhh.ptit_reviews.service.mapper.UserMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest request) {
        // Check if user already exists
        if (userService.findByEmail(request.getEmail()).isPresent()) {
            ApiResponse<AuthResponse> response = ApiResponse.<AuthResponse>builder()
                    .status(400)
                    .data(null)
                    .message("Email already exists")
                    .build();
            return ResponseEntity.badRequest().body(response);
        }

        // Create new user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .code(request.getCode())
                .role(UserRole.STUDENT)
                .build();

        user = userService.save(user);

        // Generate JWT token
        Token token = jwtService.generateToken(user);

        AuthResponse authResponse = AuthResponse.builder()
                .accessToken(token.getAccessToken())
                .refreshToken(token.getRefreshToken())
                .user(userMapper.userToUserLoginResponse(user))
                .build();

        ApiResponse<AuthResponse> response = ApiResponse.<AuthResponse>builder()
                .status(201)
                .data(authResponse)
                .message("User registered successfully")
                .build();

        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Find user
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate JWT token
        Token token = jwtService.generateToken(user);

        AuthResponse authResponse = AuthResponse.builder()
                .accessToken(token.getAccessToken())
                .refreshToken(token.getRefreshToken())
                .user(userMapper.userToUserLoginResponse(user))
                .build();

        ApiResponse<AuthResponse> response = ApiResponse.<AuthResponse>builder()
                .status(200)
                .data(authResponse)
                .message("Login successful")
                .build();

        return ResponseEntity.ok(response);
    }
}
