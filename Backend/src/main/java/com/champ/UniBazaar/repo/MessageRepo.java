package com.champ.UniBazaar.repo;

import com.champ.UniBazaar.entity.Message;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface MessageRepo extends JpaRepository<Message,Long> {

    @Query(value = """
            SELECT message_text FROM messages 
            WHERE conversation_id = :convoId 
            ORDER BY timestamp DESC 
            LIMIT 1
            """, nativeQuery = true)
    String getLastMessage(@Param("convoId") Long convoId);

    @Query(value = """
            SELECT timestamp FROM messages 
            WHERE conversation_id = :convoId 
            ORDER BY timestamp DESC 
            LIMIT 1
            """, nativeQuery = true)
    LocalDateTime getLatestTimestamp(@Param("convoId") Long convoId);


    @Query("SELECT COUNT(m) FROM Message m WHERE m.conversationId = :conversationId AND m.senderId != :userId AND m.isRead = false")
    Long countUnreadMessages(@Param("conversationId") Long conversationId, @Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("UPDATE Message m SET m.isRead = true WHERE m.conversationId = :conversationId AND m.senderId != :userId AND m.isRead = false")
    void markMessagesAsRead(@Param("conversationId") Long conversationId, @Param("userId") Long userId);

    List<Message> findByConversationId(Long convoId);
}