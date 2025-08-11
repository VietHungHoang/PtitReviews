package com.vhh.ptit_reviews.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.vhh.ptit_reviews.domain.model.User;

@Service
public interface UserService {
    User save(User user);
    Optional<User> findByEmail(String email);
}
