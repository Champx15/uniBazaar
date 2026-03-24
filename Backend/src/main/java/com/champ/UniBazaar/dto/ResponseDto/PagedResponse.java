package com.champ.UniBazaar.dto.ResponseDto;

import java.util.List;


public record PagedResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages
) {}