// package com.vhh.ptit_reviews.domain.model;

// import jakarta.persistence.*;
// import lombok.*;
// import org.springframework.security.core.GrantedAuthority;
// import org.springframework.security.core.userdetails.UserDetails;
// import java.util.Collection;
// import java.util.List;

// @Entity
// @Table(name = "users")
// @NoArgsConstructor
// @AllArgsConstructor
// @Data
// @Builder
// public class User implements UserDetails {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;
//     private String username;
//     private String email;
//     private String password;
//     private String code;

//     @Override
//     public Collection<? extends GrantedAuthority> getAuthorities() {
//         return List.of();
//     }

//     @Override
//     public boolean isAccountNonExpired() {
//         return true;
//     }

//     @Override
//     public boolean isAccountNonLocked() {
//         return true;
//     }

//     @Override
//     public boolean isCredentialsNonExpired() {
//         return true;
//     }

//     @Override
//     public boolean isEnabled() {
//         return true;
//     }
// }
