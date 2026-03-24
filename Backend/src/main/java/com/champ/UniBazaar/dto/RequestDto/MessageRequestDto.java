package com.champ.UniBazaar.dto.RequestDto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class MessageRequestDto {
    private Long senderId;
    private Long receiverId;
    private String message;
}
