package com.champ.UniBazaar.dto.ResponseDto;

import com.champ.UniBazaar.entity.Listing;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ListingResponseDto {
    private PublicListingResponseDto listing;
    private Long userId;
    private String name;
    private String pfImageUrl;

    public ListingResponseDto(Listing entity, Long userId,String name,String pfImageUrl){
        this.listing= new PublicListingResponseDto(
                entity.getId(),
                entity.getTitle(),
                entity.getPrice(),
                entity.getImageUrls(),
                entity.getTags(),
                entity.getCreatedAt(),
                entity.getStatus()
        );
        this.userId=userId;
        this.name=name;
        this.pfImageUrl=pfImageUrl;
    }

}
