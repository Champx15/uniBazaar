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
public class AdminReportDto {
    private Long id;
    private Long reporterId;
    private Listing reportedListing;
    private Long reportedUserId;
    private String reportedUserEmail;
    private String reason;
    private String description;
    private String status;

}
