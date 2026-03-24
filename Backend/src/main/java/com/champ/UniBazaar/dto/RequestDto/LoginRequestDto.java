package com.champ.UniBazaar.dto.RequestDto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class LoginRequestDto {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 254, message = "Email too long")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(max = 128, message = "Password must be 8-128 characters")
    private String pass;
}
