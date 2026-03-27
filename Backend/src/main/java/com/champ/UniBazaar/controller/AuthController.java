package com.champ.UniBazaar.controller;

import com.champ.UniBazaar.dto.RequestDto.*;
import com.champ.UniBazaar.dto.ResponseDto.CursorResponse;
import com.champ.UniBazaar.dto.ResponseDto.LoginResponseDto;
import com.champ.UniBazaar.entity.Listing;
import com.champ.UniBazaar.entity.User;
import com.champ.UniBazaar.repo.ListingRepo;
import com.champ.UniBazaar.service.AuthService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;


    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequestDto, HttpServletResponse httpResponse) {
        LoginResponseDto responseDto = authService.login(loginRequestDto.getEmail(), loginRequestDto.getPass(), httpResponse);
        if (responseDto.getSuccess()) return new ResponseEntity<>(responseDto,HttpStatus.OK);
        return new ResponseEntity<>(responseDto,HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/signup/send-mail")
    public ResponseEntity<Void> sendMail(@Valid @RequestBody EmailRequestDto emailRequestDto) throws Exception {
        Boolean userExists = authService.sendMail(emailRequestDto, "verify");
        if (userExists) return new ResponseEntity<>(HttpStatus.CONFLICT);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/signup/verify")
    public ResponseEntity<Void> verifySignup(@Valid @RequestBody SignupVerifyDto request) {
        Boolean verify = authService.verifySignup(request);
        if (verify) return new ResponseEntity<>(HttpStatus.CREATED);
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/login/check-email")
    public ResponseEntity<Void> checkEmail(@Valid @RequestBody EmailRequestDto request) throws Exception {
        Boolean userNotExist = authService.sendMail(request, "forgot");
        if (userNotExist) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/login/verify-otp")
    public ResponseEntity<?> verifyForgotPassword(@Valid @RequestBody ForgotPasswordVerifyDto verifyDto, HttpServletResponse response) {
        Boolean verified = authService.verifyForgotPassword(verifyDto);
        if (verified) {
            authService.getResetToken(verifyDto.getEmail(), response);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/login/reset-pass")
    public ResponseEntity<Void> resetPass(@Valid @RequestBody PassRequestDto requestDto, HttpServletRequest request) {
        Boolean resetFailed = authService.resetPass(requestDto.getNewPass(), request);
        if (resetFailed) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/google")
    public ResponseEntity<Void> googleAuth(
            @RequestBody GoogleTokenRequest request,
            HttpServletResponse response
    ) throws Exception {
        authService.googleAuth(request,response);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

}
