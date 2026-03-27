package com.champ.UniBazaar.service;

import com.champ.UniBazaar.config.JwtService;
import com.champ.UniBazaar.dto.RequestDto.EmailRequestDto;
import com.champ.UniBazaar.dto.RequestDto.ForgotPasswordVerifyDto;
import com.champ.UniBazaar.dto.RequestDto.GoogleTokenRequest;
import com.champ.UniBazaar.dto.ResponseDto.LoginResponseDto;
import com.champ.UniBazaar.dto.RequestDto.SignupVerifyDto;
import com.champ.UniBazaar.entity.User;
import com.champ.UniBazaar.enums.UserStatus;
import com.champ.UniBazaar.repo.ProfileRepo;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
    @Autowired
    private OtpService otpService;
    @Autowired
    private RedisService redisService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private ProfileRepo profileRepo;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authManager;
    @Autowired
    private GoogleService googleService;

    @Value("${cookie.secure}")
    private boolean cookieSecure;

    @Value("${cookie.sameSite}")
    private String cookieSameSite;

    public LoginResponseDto login(String email, String pass, HttpServletResponse httpResponse) {
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, pass)
            );

            if (authentication.isAuthenticated()) {
                User user = profileRepo.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User doesn't exist"));
                if (user.getStatus().equals(UserStatus.BANNED)) {
                    return new LoginResponseDto(false, "BANNED");
                }

                String jwt = jwtService.generateToken(user.getId().toString(), user.getEmail());
                ResponseCookie cookie = ResponseCookie
                        .from("accessToken", jwt)
                        .httpOnly(true)
                        .secure(cookieSecure)
                        .path("/")
                        .maxAge(14 * 24 * 60 * 60)
                        .sameSite(cookieSameSite)
                        .build();
                httpResponse.addHeader("Set-Cookie", cookie.toString());
                return new LoginResponseDto(true, "SUCCESS");
            }
            return new LoginResponseDto(false, "INVALID_CREDENTIALS");
        } catch (AuthenticationException e) {
            return new LoginResponseDto(false, "INVALID_CREDENTIALS");
        }
    }

    public void logout(HttpServletResponse response) {

        Cookie cookie = new Cookie("accessToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // false for localhost
        cookie.setPath("/");
        cookie.setMaxAge(0); // delete immediately
        response.addCookie(cookie);
    }

    public Boolean sendMail(EmailRequestDto dto, String action) throws Exception {
        User byEmail = profileRepo.findByEmail(dto.getEmail()).orElseGet(() -> null);
        boolean enrollment = profileRepo.existsByEnrollmentNo(dto.getEnrollmentNo());
        if ((byEmail != null || enrollment) && action.equals("verify")) return true;
        if (byEmail == null && action.equals("forgot")) return true;
        String otp = otpService.generateOtp();
        redisService.saveOtp(dto.getEmail(), otp);
        if (action.equals("verify")) emailService.sendVerifyEmail(dto.getEmail(), otp);
        else emailService.sendForgotEmail(dto.getEmail(), otp);
        return false;
    }

    public Boolean verifySignup(SignupVerifyDto verifyDto) {
        String otp = redisService.getOtp(verifyDto.getEmail());
        String receivedOtp = String.valueOf(verifyDto.getOtp());
        if (receivedOtp.equals(otp)) {
            String encodedPass = encoder.encode(verifyDto.getPass());
            User user = new User(verifyDto.getEmail(), encodedPass, verifyDto.getName(),
                    verifyDto.getPfImageUrl(), verifyDto.getEnrollmentNo());
            profileRepo.save(user);
            redisService.deleteOtp(verifyDto.getEmail());
            return true;
        }
        return false;
    }

    public Boolean verifyForgotPassword(ForgotPasswordVerifyDto verifyDto) {
        String otp = redisService.getOtp(verifyDto.getEmail());
        String receivedOtp = String.valueOf(verifyDto.getOtp());
        if (receivedOtp.equals(otp)) {
            redisService.deleteOtp(verifyDto.getEmail());
            return true;
        }
        return false;
    }

    public Boolean resetPass(String newPass, HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String resetToken = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("resetToken".equals(cookie.getName())) {
                    resetToken = cookie.getValue();
                }
            }
        } else return true;
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) return true;
//        String token = authHeader.substring(7);
        String email = jwtService.validateResetToken(resetToken);
        User user = profileRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User doesn't exist"));
        ;
        String encodedPass = encoder.encode(newPass);
        user.setPassHash(encodedPass);
        profileRepo.save(user);
        return false;
    }

    public void getResetToken(String email, HttpServletResponse response) {
        String resetToken = jwtService.generateResetToken(email);
        ResponseCookie cookie = ResponseCookie
                .from("resetToken", resetToken)
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(5 * 60)
                .sameSite(cookieSameSite)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }

    public void googleAuth(GoogleTokenRequest request, HttpServletResponse response) throws Exception {
        GoogleIdToken.Payload payload = googleService.verify(request.getToken());
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String picture = (String) payload.get("picture");

        User user = profileRepo.findByEmail(email).orElseGet(() -> {
            User newUser = new User(email, null, name, picture, null);
            return profileRepo.save(newUser);
        });

        String jwt = jwtService.generateToken(
                user.getId().toString(),
                user.getEmail()
        );

        ResponseCookie cookie = ResponseCookie
                .from("accessToken", jwt)
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(14 * 24 * 60 * 60)
                .sameSite(cookieSameSite)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());


    }
}
