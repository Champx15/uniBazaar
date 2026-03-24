package com.champ.UniBazaar.controller;

import com.champ.UniBazaar.dto.ResponseDto.InboxDto;
import com.champ.UniBazaar.dto.RequestDto.MessageRequestDto;
import com.champ.UniBazaar.entity.Message;
import com.champ.UniBazaar.repo.MessageRepo;
import com.champ.UniBazaar.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {
    @Autowired private MessageService messageService;
    @Autowired private MessageRepo messageRepo;

    @GetMapping
    public ResponseEntity<List<InboxDto>> getInbox(Authentication authentication){
        Long userId = Long.parseLong(authentication.getName());
        List<InboxDto> inbox = messageService.getInbox(userId);
        return ResponseEntity.ok(inbox);
    }

    @PostMapping
    public ResponseEntity<Void> addMessage(@RequestBody MessageRequestDto dto, Authentication authentication){
     Long senderId = Long.parseLong(authentication.getName());
        dto.setSenderId(senderId);
        Boolean msgSaved = messageService.addMessage(dto);
        if(msgSaved)  return new ResponseEntity<>(HttpStatusCode.valueOf(201));
        return new ResponseEntity<>(HttpStatusCode.valueOf(422));
    }

    @GetMapping("/{otherUserId}")
    public ResponseEntity<List<Message>> getConversation(
            Authentication authentication,
            @PathVariable Long otherUserId){
        Long senderId = Long.parseLong(authentication.getName());
        List<Message> messages = messageService.getMessage(senderId, otherUserId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/mark-read")
    public ResponseEntity<?> markAsRead(
            @RequestParam Long conversationId,
            @RequestParam Long userId) {
        try {
            messageRepo.markMessagesAsRead(conversationId, userId);
            return ResponseEntity.ok("Messages marked as read");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
