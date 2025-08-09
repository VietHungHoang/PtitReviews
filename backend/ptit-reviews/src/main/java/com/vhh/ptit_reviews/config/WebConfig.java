package com.vhh.ptit_reviews.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // áp dụng cho tất cả endpoint
                .allowedOrigins("*") // cho phép tất cả domain
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }
}
