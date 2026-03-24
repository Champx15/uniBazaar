package com.champ.UniBazaar.dto.RequestDto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class FeedbackDto {
    @Size(max=500, message = "feedback too long")
    private String feedback;

}
