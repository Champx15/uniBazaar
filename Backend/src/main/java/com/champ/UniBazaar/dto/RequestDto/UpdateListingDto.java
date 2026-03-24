package com.champ.UniBazaar.dto.RequestDto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UpdateListingDto {
    @Size(min = 5, max = 100, message = "Title must be 5-100 characters")
    private String title;

    @DecimalMin(value = "1", message = "Price must be at least ₹1")
    @DecimalMax(value = "999999", message = "Price must be less than ₹999,999")
    private BigDecimal price;

    @Size(max = 1000, message = "Description must be less than 1000 characters")
    private String description;

    @Size(max = 3, message = "Maximum 3 images allowed")
    private List<String> imageUrls;

    @Size(max = 8, message = "Maximum 8 tags allowed")
    private List<String> tags;
}