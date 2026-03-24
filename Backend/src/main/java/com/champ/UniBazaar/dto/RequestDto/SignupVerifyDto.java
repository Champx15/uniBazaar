package com.champ.UniBazaar.dto.RequestDto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.annotation.Nullable;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SignupVerifyDto {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 128, message = "Password must be 8-128 characters")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).*$",
            message = "Password must contain at least 1 number and 1 special character"
    )
    private String pass;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be 2-100 characters")
    private String name;

    @NotNull(message = "Enrollment number is required")
    private Long enrollmentNo;

    @NotNull(message = "OTP is required")
    @Digits(integer = 6, fraction = 0, message = "OTP must be exactly 6 digits")
    private Long otp;

    @Nullable
    private String pfImageUrl;
}