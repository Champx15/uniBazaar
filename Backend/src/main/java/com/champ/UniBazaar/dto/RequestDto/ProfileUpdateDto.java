package com.champ.UniBazaar.dto.RequestDto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.annotation.Nullable;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProfileUpdateDto {
    @Size(min = 2, max = 100, message = "Name must be 2-100 characters")
    private String name;
    @Nullable
    @Pattern(
            regexp = "^https://res\\.cloudinary\\.com/.+\\.(jpg|jpeg|png|webp)$",
            message = "Invalid profile image URL"
    )
    private String pfImageUrl;
}
