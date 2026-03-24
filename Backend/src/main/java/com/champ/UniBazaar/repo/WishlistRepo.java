package com.champ.UniBazaar.repo;

import com.champ.UniBazaar.entity.Listing;
import com.champ.UniBazaar.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface WishlistRepo extends JpaRepository<Wishlist,Long> {
    Optional<Wishlist> findByUserId(Long userId);
    @Query("""
       SELECT l.id
       FROM Wishlist w
       JOIN w.listings l
       WHERE w.user.id = :userId
       """)
    Optional<Set<Long>> findListingIdsByUserId(@Param("userId") Long userId);

}
