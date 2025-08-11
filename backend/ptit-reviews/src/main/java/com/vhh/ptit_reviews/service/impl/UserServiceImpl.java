package com.vhh.ptit_reviews.service.impl;

import com.vhh.ptit_reviews.domain.model.User;
import com.vhh.ptit_reviews.repository.UserRepository;
import com.vhh.ptit_reviews.service.UserService;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // @Override
    // public User authenticate(String username, String password) {
    //     User user = userRepository.findByUsername(username);
    //     if (user != null && passwordEncoder.matches(password, user.getPassword())) {
    //         return user;
    //     }
    //     return null;
    // }
}
