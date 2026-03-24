package com.champ.UniBazaar.dto.ResponseDto;

import com.champ.UniBazaar.entity.Listing;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExploreResponseDto {
    private PublicListingResponseDto listing;
    private Boolean wishlisted;

    public ExploreResponseDto(Listing entity, Boolean isWishlisted){
        this.listing = new PublicListingResponseDto(
                entity.getId(),
                entity.getTitle(),
                entity.getPrice(),
                entity.getImageUrls(),
                entity.getTags(),
                entity.getCreatedAt(),
                entity.getStatus()
        );
        this.wishlisted=isWishlisted;
    }
}
