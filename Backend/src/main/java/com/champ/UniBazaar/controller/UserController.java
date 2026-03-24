package com.champ.UniBazaar.controller;

import com.champ.UniBazaar.dto.RequestDto.FeedbackDto;
import com.champ.UniBazaar.dto.RequestDto.ProfileUpdateDto;
import com.champ.UniBazaar.entity.User;
import com.champ.UniBazaar.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired private UserService userService;

    @GetMapping
    public ResponseEntity<User> getUser(Authentication authentication){
        Long userId = Long.parseLong(authentication.getName());
        User user = userService.get(userId);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping
    public ResponseEntity<HttpStatus> deleteAccount(Authentication authentication){
        Long userId = Long.parseLong(authentication.getName());
        userService.delete(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping
    public ResponseEntity<Void> updateAccount(@RequestBody ProfileUpdateDto updateDto, Authentication authentication){
        Long userId = Long.parseLong(authentication.getName());
        userService.update(updateDto,userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/feedback")
    public ResponseEntity<Void> feedback(@RequestBody FeedbackDto dto, Authentication authentication) throws Exception {
        Long userId = Long.parseLong(authentication.getName());
        userService.feedback(userId,dto);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
