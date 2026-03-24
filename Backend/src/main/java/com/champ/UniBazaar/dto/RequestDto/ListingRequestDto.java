package com.champ.UniBazaar.dto.RequestDto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ListingRequestDto {
    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 100, message = "Title must be 5-100 characters")
    private String title;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "1", message = "Price must be at least ₹1")
    @DecimalMax(value = "999999", message = "Price must be less than ₹999,999")
    private BigDecimal price;

    @Size(max = 1000, message = "Description must be less than 1000 characters")
    private String description;

    @NotEmpty(message = "At least one image is required")
    @Size(max = 3, message = "Maximum 3 images allowed")
    private List<String> imageUrls;

    @NotEmpty(message = "At least one tag is required")
    @Size(max = 8, message = "Maximum 8 tags allowed")
    private List<String> tags;
}