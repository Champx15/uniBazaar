package com.champ.UniBazaar.repo;

import com.champ.UniBazaar.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConversationRepo extends JpaRepository<Conversation,Long> {

    @Query(value = """
            SELECT * FROM conversations WHERE user1id = :userId OR user2id = :userId
            """, nativeQuery = true)
    List<Conversation> findConversationsByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Conversation c WHERE (c.user1Id = :user1 AND c.user2Id = :user2) OR (c.user1Id = :user2 AND c.user2Id = :user1)")
    Optional<Conversation> findConversationBetweenUsers(@Param("user1") Long user1, @Param("user2") Long user2);

}
