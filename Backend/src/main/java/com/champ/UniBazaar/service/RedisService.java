package com.champ.UniBazaar.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisService {
    @Autowired
    private StringRedisTemplate redisTemplate;

    public void saveOtp(String email, String otp) {
        redisTemplate.opsForValue().set("UniBazaarOtp:" + email, otp, 300, TimeUnit.SECONDS);
    }

    public String getOtp(String email) {
        return redisTemplate.opsForValue().get("UniBazaarOtp:" + email);
    }

    public void deleteOtp(String email) {
        redisTemplate.delete("UniBazaarOtp:" + email);
    }

}
