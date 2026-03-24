package com.champ.UniBazaar.dto.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InboxDto {
    private Long otherUserId;  // Add this
    private String name;
    private String pfImageUrl;
    private String lastMessage;
    private Long conversationId;  // Optional but useful
    private Long unReadCount;
    private LocalDateTime timestamp;
}
