// package com.vhh.ptit_reviews.service.impl;

// import com.vhh.ptit_reviews.domain.model.User;
// import com.vhh.ptit_reviews.repository.UserRepository;
// import com.vhh.ptit_reviews.service.UserService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;

// @Service
// @RequiredArgsConstructor
// public class UserServiceImpl implements UserService {
//     private final UserRepository userRepository;
//     private final PasswordEncoder passwordEncoder;

//     @Override
//     public User register(User user) {
//         user.setPassword(passwordEncoder.encode(user.getPassword()));
//         return userRepository.save(user);
//     }

//     @Override
//     public User authenticate(String username, String password) {
//         User user = userRepository.findByUsername(username);
//         if (user != null && passwordEncoder.matches(password, user.getPassword())) {
//             return user;
//         }
//         return null;
//     }
// }
