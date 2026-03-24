package com.champ.UniBazaar.dto.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StatsDto {
   private Long totalUsers;
    private Long  activeUsers;
    private Long totalListings;
    private Long  pendingReports;
    private Long  pendingVerifications;
}
