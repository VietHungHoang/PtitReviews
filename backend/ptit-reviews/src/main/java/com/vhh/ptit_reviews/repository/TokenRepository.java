// package com.vhh.ptit_reviews.repository;

// import com.vhh.ptit_reviews.domain.model.Token;
// import com.vhh.ptit_reviews.domain.model.User;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

// import java.util.List;
// import java.util.Optional;

// @Repository
// public interface TokenRepository extends JpaRepository<Token, Long> {
//     Optional<Token> findByAccessToken(String accessToken);
//     Optional<Token> findByRefreshToken(String refreshToken);
//     List<Token> findAllByUser(User user);
// }
