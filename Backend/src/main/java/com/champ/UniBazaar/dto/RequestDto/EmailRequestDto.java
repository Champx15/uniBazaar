package com.champ.UniBazaar.dto.RequestDto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.annotation.Nullable;

@NoArgsConstructor
@Data
public class EmailRequestDto {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 254, message = "Email too long")
    private String email;

    @Nullable
    @Digits(integer = 15, fraction = 0, message = "Enrollment number must be 15 digits or less")
    private Long enrollmentNo;
}
