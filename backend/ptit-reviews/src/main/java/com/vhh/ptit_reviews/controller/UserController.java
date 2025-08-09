// package com.vhh.ptit_reviews.controller;

// import com.vhh.ptit_reviews.domain.model.User;
// import com.vhh.ptit_reviews.domain.model.Token;
// import com.vhh.ptit_reviews.service.UserService;
// import com.vhh.ptit_reviews.service.TokenService;
// import com.vhh.ptit_reviews.config.JwtService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/api/auth")
// @RequiredArgsConstructor
// public class UserController {
//     private final UserService userService;
//     private final JwtService jwtService;
//     private final TokenService tokenService;

//     @PostMapping("/register")
//     public ResponseEntity<?> register(@RequestBody User user) {
//         User savedUser = userService.register(user);
//         Token token = jwtService.generateToken(savedUser);
//         tokenService.save(token);
//         return ResponseEntity.ok(token);
//     }

//     @PostMapping("/login")
//     public ResponseEntity<?> login(@RequestBody User user) {
//         User authenticated = userService.authenticate(user.getUsername(), user.getPassword());
//         if (authenticated == null) {
//             return ResponseEntity.status(401).body("Invalid credentials");
//         }
//         Token token = jwtService.generateToken(authenticated);
//         tokenService.save(token);
//         return ResponseEntity.ok(token);
//     }
// }
