package com.champ.UniBazaar.dto.RequestDto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ForgotPasswordVerifyDto {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Digits(integer = 6,fraction = 0, message = "Otp must be 6 digits")
    @NotNull(message = "OTP is required")
    private Long otp;


}