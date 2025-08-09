// package com.vhh.ptit_reviews.config;

// import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.SignatureAlgorithm;

// import com.vhh.ptit_reviews.domain.model.Token;
// import com.vhh.ptit_reviews.domain.model.User;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.stereotype.Service;
// import java.util.Date;
// import java.util.HashMap;
// import java.util.Map;
// import java.util.function.Function;

// @Service
// public class JwtService {
//     private final String SECRET_KEY = "your_secret_key_here";
//     private final long ACCESS_TOKEN_VALIDITY = 1000 * 60 * 60; // 1 hour
//     private final long REFRESH_TOKEN_VALIDITY = 1000 * 60 * 60 * 24 * 7; // 7 days

//     public String extractUsername(String token) {
//         return extractClaim(token, Claims::getSubject);
//     }

//     public Date extractExpiration(String token) {
//         return extractClaim(token, Claims::getExpiration);
//     }

//     public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
//         final Claims claims = extractAllClaims(token);
//         return claimsResolver.apply(claims);
//     }

//     private Claims extractAllClaims(String token) {
//         return Jwts.parser()
//                 .setSigningKey(SECRET_KEY)
//                 .parseClaimsJws(token)
//                 .getBody();
//     }

//     private Boolean isTokenExpired(String token) {
//         return extractExpiration(token).before(new Date());
//     }

//     public Token generateToken(UserDetails userDetails) {
//         Map<String, Object> claims = new HashMap<>();
//         long now = System.currentTimeMillis();
//         Date accessTokenExpiration = new Date(now + ACCESS_TOKEN_VALIDITY);
//         Date refreshTokenExpiration = new Date(now + REFRESH_TOKEN_VALIDITY);
//         String accessToken = createToken(claims, userDetails.getUsername(), accessTokenExpiration);
//         String refreshToken = createToken(claims, userDetails.getUsername(), refreshTokenExpiration);
//         Token token = Token.builder()
//                 .accessToken(accessToken)
//                 .refreshToken(refreshToken)
//                 .expiredDate(accessTokenExpiration)
//                 .build();
//         if (userDetails instanceof User) {
//             token.setUser((User) userDetails);
//         }
//         return token;
//     }

//     private String createToken(Map<String, Object> claims, String subject, Date expiration) {
//         return Jwts.builder()
//                 .setClaims(claims)
//                 .setSubject(subject)
//                 .setIssuedAt(new Date(System.currentTimeMillis()))
//                 .setExpiration(expiration)
//                 .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
//                 .compact();
//     }

//     public Boolean isTokenValid(String token, UserDetails userDetails) {
//         final String username = extractUsername(token);
//         return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
//     }

//     // Token entity is now used for token management
// }
