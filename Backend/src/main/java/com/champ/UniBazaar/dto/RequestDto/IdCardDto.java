package com.champ.UniBazaar.dto.RequestDto;

import io.micrometer.common.lang.Nullable;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class IdCardDto {
    @NotNull(message = "Id Card is required")
    @Pattern(
            regexp = "^https://res\\.cloudinary\\.com/.+\\.(jpg|jpeg|png|webp)$",
            message = "Invalid image URL. Must be from Cloudinary"
    )
    private String idCardUrl;

    @Nullable
    @Min(value = 1, message = "Enrollment number must be valid")
    @Digits(integer = 15, fraction = 0, message = "Enrollment number must be 15 digits or less")
    private Long enrollmentNo;
}
