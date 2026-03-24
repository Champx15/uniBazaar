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
public class AdminListingDto {
    private Listing listing;
    private String userEmail;
}
