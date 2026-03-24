package com.champ.UniBazaar.service;

import com.champ.UniBazaar.dto.ResponseDto.InboxDto;
import com.champ.UniBazaar.dto.RequestDto.MessageRequestDto;
import com.champ.UniBazaar.dto.PerspectiveDto.PerspectiveResponse;
import com.champ.UniBazaar.entity.Conversation;
import com.champ.UniBazaar.entity.Message;
import com.champ.UniBazaar.entity.User;
import com.champ.UniBazaar.enums.UserStatus;
import com.champ.UniBazaar.repo.ConversationRepo;
import com.champ.UniBazaar.repo.MessageRepo;
import com.champ.UniBazaar.repo.ProfileRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired private ConversationRepo conversationRepo;
    @Autowired private MessageRepo messageRepo;
    @Autowired private ProfileRepo profileRepo;
    @Autowired private PerspectiveService perspectiveService;

    public List<InboxDto> getInbox(Long userId) {
        List<Conversation> conversations = conversationRepo.findConversationsByUserId(userId);

        return conversations.stream()
                .map(convo -> {
                    Long otherUserId = Objects.equals(convo.getUser1Id(),userId)
                            ? convo.getUser2Id()
                            : convo.getUser1Id();

                    String lastMessage = messageRepo.getLastMessage(convo.getId());
                    User user = profileRepo.findById(otherUserId)
                            .orElseThrow(() -> new RuntimeException("User doesn't exist"));
                    Long unread = messageRepo.countUnreadMessages(convo.getId(),userId);
                    LocalDateTime timestamp = messageRepo.getLatestTimestamp(convo.getId());

                    return new InboxDto(user.getId(),user.getName(), user.getPfImageUrl(), lastMessage,convo.getId(),unread,timestamp);
                })
                .collect(Collectors.toList());
    }

    public Boolean addMessage(MessageRequestDto dto){

        //Not needed as of now
//        User sender = profileRepo.findById(dto.getSenderId()).orElseThrow(() -> new RuntimeException("Sender doesn't exits"));
//        User receiver = profileRepo.findById(dto.getReceiverId()).orElseThrow(() -> new RuntimeException("Sender doesn't exits"));
//        if(sender.getStatus().equals(UserStatus.UNVERIFIED) || receiver.getStatus().equals(UserStatus.UNVERIFIED)) return false;

        Conversation conversation = conversationRepo
                .findConversationBetweenUsers(dto.getSenderId(),dto.getReceiverId())
                .orElseGet(() -> {
                    Conversation newConvo = new Conversation(dto.getSenderId(), dto.getReceiverId());
                    return conversationRepo.save(newConvo);
                });

        // Check for toxic content
        boolean isToxic = false;
        try {
            PerspectiveResponse response = perspectiveService.apiCall(dto.getMessage());
            isToxic = perspectiveService.isToxic(response);
        } catch (Exception e) {
            System.err.println("Perspective API error: " + e.getMessage());
        }

        // Check for Indian swear words
        if (!isToxic && perspectiveService.containsIndianSwear(dto.getMessage())) {
            isToxic = true;
        }
        if(!isToxic){
        Message message = new Message(conversation.getId(), dto.getSenderId(), dto.getMessage());
        messageRepo.save(message);
        return true;
        }
        return false;
    }

    public List<Message> getMessage(Long senderId, Long receiverId){
        Conversation conversation = conversationRepo.findConversationBetweenUsers(senderId, receiverId).orElseThrow(() -> new RuntimeException("Conversation doesn't exist"));
        return messageRepo.findByConversationId(conversation.getId());
    }
}