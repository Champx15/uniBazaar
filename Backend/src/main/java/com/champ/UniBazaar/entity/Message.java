package com.champ.UniBazaar.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "messages")
@NoArgsConstructor
@Getter
@Setter
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long conversationId;
    private Long senderId;
    @Column(columnDefinition = "TEXT")
    private String messageText;
    @CreationTimestamp
    private Timestamp timestamp;
    private Boolean isRead=false;

    public Message(Long conversationId, Long senderId, String messageText) {
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.messageText = messageText;
    }
}
