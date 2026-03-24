package com.champ.UniBazaar.controller;

import com.champ.UniBazaar.dto.RequestDto.IdCardDto;
import com.champ.UniBazaar.service.IdCardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/id-card")
public class IdCardController {

    @Autowired private IdCardService idCardService;

    @PostMapping
    public ResponseEntity<Void> uploadIdCard(@Valid @RequestBody IdCardDto dto, Authentication authentication){
        Long userId = Long.parseLong(authentication.getName());
        idCardService.uploadIdCard(userId,dto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
