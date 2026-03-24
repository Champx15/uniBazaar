package com.champ.UniBazaar.dto.RequestDto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ReportResolveDto {
    private String resolution;
    private String type;
    private Long id;
}
