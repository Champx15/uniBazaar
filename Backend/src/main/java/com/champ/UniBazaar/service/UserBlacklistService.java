package com.champ.UniBazaar.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class UserBlacklistService {
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    private static final long TOKEN_EXPIRY = 60 * 60;

    public boolean isBlacklisted(Long userId) {
        return redisTemplate.hasKey("user_banned:" + userId);
    }

    public void blacklistUser(Long userId) {
        redisTemplate.opsForValue().set(
                "user_banned:" + userId,
                "true",
                TOKEN_EXPIRY,
                TimeUnit.SECONDS
        );
    }

    public void removeFromBlocklist(Long userId){
        redisTemplate.delete("user_banned:"+userId);
    }



}
