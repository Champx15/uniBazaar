package com.champ.UniBazaar.dto.ResponseDto;

import com.champ.UniBazaar.enums.ListingStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PublicListingResponseDto {
    private Long id;
    private String title;
    private BigDecimal price;
    private List<String> imageUrls;
    private List<String> tags;
    private Instant createdAt;
    private ListingStatus status;
}
