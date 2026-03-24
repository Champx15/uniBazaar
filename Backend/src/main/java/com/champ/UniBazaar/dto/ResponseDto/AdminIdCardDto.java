package com.champ.UniBazaar.dto.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AdminIdCardDto {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private Long enrollment;
    private Timestamp submitted;
    private String idCardUrl;

}
