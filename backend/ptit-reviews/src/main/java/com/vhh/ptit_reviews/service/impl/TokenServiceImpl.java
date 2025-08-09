// package com.vhh.ptit_reviews.service.impl;

// import com.vhh.ptit_reviews.domain.model.Token;
// import com.vhh.ptit_reviews.domain.model.User;
// import com.vhh.ptit_reviews.repository.TokenRepository;
// import com.vhh.ptit_reviews.service.TokenService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.stereotype.Service;

// import java.util.List;
// import java.util.Optional;

// @Service
// @RequiredArgsConstructor
// public class TokenServiceImpl implements TokenService {
//     private final TokenRepository tokenRepository;

//     @Override
//     public Token save(Token token) {
//         return tokenRepository.save(token);
//     }

//     @Override
//     public Optional<Token> findByAccessToken(String accessToken) {
//         return tokenRepository.findByAccessToken(accessToken);
//     }

//     @Override
//     public Optional<Token> findByRefreshToken(String refreshToken) {
//         return tokenRepository.findByRefreshToken(refreshToken);
//     }

//     @Override
//     public List<Token> findAllByUser(User user) {
//         return tokenRepository.findAllByUser(user);
//     }

//     @Override
//     public void delete(Token token) {
//         tokenRepository.delete(token);
//     }
// }
