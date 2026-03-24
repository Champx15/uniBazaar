package com.champ.UniBazaar.dto.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CursorResponse<T> {
    private List<T> content;
//    private int pageSize;
    private Long nextCursorId;
    private Instant nextCursorCreatedAt;
    boolean hasNext;


}
