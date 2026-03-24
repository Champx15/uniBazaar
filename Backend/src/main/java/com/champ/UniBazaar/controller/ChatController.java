package com.champ.UniBazaar.controller;

import com.champ.UniBazaar.dto.RequestDto.MessageRequestDto;
import com.champ.UniBazaar.dto.PerspectiveDto.PerspectiveResponse;
import com.champ.UniBazaar.entity.User;
import com.champ.UniBazaar.enums.UserStatus;
import com.champ.UniBazaar.repo.ProfileRepo;
import com.champ.UniBazaar.service.MessageService;
import com.champ.UniBazaar.service.PerspectiveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    @Autowired
    private PerspectiveService perspectiveService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private MessageService messageService;
    @Autowired private ProfileRepo profileRepo;

    @MessageMapping("/chat")
    public void handleChatMessage(MessageRequestDto msg, Authentication authentication) {
        try {
            // Validate input
            Long senderId = Long.parseLong(authentication.getName());
            if (msg.getSenderId() == null || msg.getReceiverId() == null || msg.getMessage() == null) {
                System.err.println("❌ Invalid message: missing required fields");
                return;
            }
            msg.setSenderId(senderId);

            // Not needed as of now
//            User sender = profileRepo.findById(msg.getSenderId()).orElseThrow(() -> new RuntimeException("Sender doesn't exits"));
//            User receiver = profileRepo.findById(msg.getReceiverId()).orElseThrow(() -> new RuntimeException("Sender doesn't exits"));
//            if(sender.getStatus().equals(UserStatus.UNVERIFIED) || receiver.getStatus().equals(UserStatus.UNVERIFIED)) return;
            String messageText = msg.getMessage().trim();
            if (messageText.isEmpty()) {
                System.err.println("❌ Invalid message: empty message text");
                return;
            }

            System.out.println("📨 WebSocket message from " + msg.getSenderId() + " to " + msg.getReceiverId() + ": " + messageText);

            // Check for toxic content
            boolean isToxic = false;
            try {
                PerspectiveResponse response = perspectiveService.apiCall(messageText);
                isToxic = perspectiveService.isToxic(response);
            } catch (Exception e) {
                System.err.println("⚠️ Perspective API error: " + e.getMessage());
                // Continue anyway - don't block messages on API failure
            }

            // Check for Indian swear words
            if (!isToxic && perspectiveService.containsIndianSwear(messageText)) {
                isToxic = true;
            }

            // If message is toxic, reject it
            if (isToxic) {
                System.out.println("🚫 Message rejected: toxic content detected");
                return;
            }

            // Message is clean - send to recipient in real-time if they're online
            messagingTemplate.convertAndSendToUser(
                    msg.getReceiverId().toString(),
                    "/queue/messages",
                    msg
            );
            System.out.println("✓ Message delivered to recipient via WebSocket: " + msg.getReceiverId());

        } catch (Exception e) {
            System.err.println("❌ Error handling message: " + e.getMessage());
            e.printStackTrace();
        }
    }


}