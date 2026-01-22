package com.tienda.carrito.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private Long expiration;


    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(
                secretKey.getBytes(StandardCharsets.UTF_8)
        );
    }

    public String extractEmail(String token) {
        try {
            return extractAllClaims(token).getSubject();
        } catch (Exception e) {
            System.out.println("❌ ERROR extractEmail(): " + e.getMessage());
            return null;
        }
    }

    public String extractRol(String token) {
        try {
            return extractAllClaims(token).get("rol", String.class);
        } catch (Exception e) {
            System.out.println("❌ ERROR extractRol(): " + e.getMessage());
            return null;
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
    }

    public Boolean validateToken(String token, String email) {
        try {
            String username = extractEmail(token);
            return (username != null && username.equals(email) && !isTokenExpired(token));
        } catch (Exception e) {
            System.out.println("❌ ERROR validateToken(): " + e.getMessage());
            return false;
        }
    }

    private Boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    public String generateToken(String email, String rol) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", rol);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}
