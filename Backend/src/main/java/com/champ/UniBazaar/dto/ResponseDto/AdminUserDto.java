package com.champ.UniBazaar.dto.ResponseDto;

import com.champ.UniBazaar.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AdminUserDto {
    private User user;
    private Integer listingsLength;
}
