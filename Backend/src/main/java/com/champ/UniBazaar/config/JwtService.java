package com.champ.UniBazaar.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private final String secretKey;

    public JwtService(@Value("${hmac.secret}") String secretKey) {
        this.secretKey = secretKey;
    }

    public String generateResetToken(String email) {
        return Jwts.builder()
                .claim("type", "RESET")
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 5 * 60 * 1000)) // 5 mins
                .signWith(getKey(), SignatureAlgorithm.HS256).compact();
    }

    public String generateToken(String id,String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email",email);
        return Jwts.builder().claims(claims).subject(id).issuedAt(new Date(System.currentTimeMillis())).expiration(new Date(System.currentTimeMillis() + 12_960_00L)).signWith(getKey(), SignatureAlgorithm.HS256).compact();
    }

    private Key getKey() {
        byte[] b = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(b);

    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public String extractUserName(String token) {return extractClaim(token, Claims::getSubject);
    }
    public String extractEmail(String token) {
        return extractClaim(token, claims -> claims.get("email", String.class));
    }
    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(getKey()).build().parseSignedClaims(token).getPayload();
    }

    public String validateResetToken(String token) {
        Claims claims = extractAllClaims(token);

        if (!claims.get("type").equals("RESET")) {
            throw new RuntimeException("Invalid token type");
        }

        if (claims.getExpiration().before(new Date())) {
            throw new RuntimeException("Token expired");
        }

        return claims.getSubject(); // returns email
    }



}
