package com.champ.UniBazaar.repo;

import com.champ.UniBazaar.entity.Listing;
import com.champ.UniBazaar.enums.ListingStatus;
import com.champ.UniBazaar.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Set;

public interface ListingRepo extends JpaRepository<Listing, Long> {
    boolean existsByIdAndUser_Id(Long id, Long userId);

    //    List<Listing> findByUserId(Long userId);
    List<Listing> findByUserIdAndStatusIn(Long userId, List<ListingStatus> statuses);

//    Page<Listing> findByStatusAndUser_Status(
//            ListingStatus status,
//            UserStatus userStatus,
//            Pageable pageable);

    //    Page<Listing> findByStatus(ListingStatus status, Pageable pageable);
    //    Page<Listing> findByAvailable(Boolean available, Pageable pageable);

    @Query(value = """
            SELECT tags from listing_tags
            """, nativeQuery = true)
    Set<String> getTagsByAvailability();

    Long countByStatusAndUser_Id(ListingStatus status, Long userId);

    Listing findByIdAndStatusNot(Long id, ListingStatus status);

    @Query("""
            SELECT l
            FROM Listing l
            JOIN l.user u
            WHERE (
                CAST(:cursorCreatedAt AS java.time.Instant) IS NULL
                OR l.createdAt < :cursorCreatedAt
                OR (l.createdAt = :cursorCreatedAt AND l.id < :cursorId)
            )
            AND l.status = 'ACTIVE'
            AND u.status = 'ACTIVE'
            ORDER BY l.createdAt DESC, l.id DESC
            """)
    List<Listing> getExploreCursor(
            @Param("cursorCreatedAt") Instant cursorCreatedAt,
            @Param("cursorId") Long cursorId,
            Pageable pageable
    );

    List<Listing> findByTitleContainingIgnoreCase(String title);

//    @Query(value = """
//            SELECT l.*
//            FROM listings l
//            JOIN listing_tags t ON l.id = t.listing_id
//            WHERE l.price BETWEEN :minPrice AND :maxPrice
//            AND t.tags IN (:tags)
//            GROUP BY l.id
//            HAVING COUNT(DISTINCT t.tags) = :tagCount
//            """, nativeQuery = true)
//    List<Listing> filter(@Param("minPrice") Long minPrice,
//                         @Param("maxPrice") Long maxPrice,
//                         @Param("tags") List<String> tags,
//                         @Param("tagCount") Integer tagCount);
//
//    // For when NO tags are provided (just price range)
//    @Query(value = """
//    SELECT DISTINCT l.*
//    FROM listings l
//    WHERE l.price BETWEEN :minPrice AND :maxPrice
//    """, nativeQuery = true)
//    List<Listing> filterByPriceOnly(@Param("minPrice") Long minPrice,
//                                    @Param("maxPrice") Long maxPrice);

    @Query(value = """
    SELECT l.*
    FROM listings l
    WHERE l.price BETWEEN :minPrice AND :maxPrice

    AND (
        :conditions IS NULL OR EXISTS (
            SELECT 1 FROM listing_tags t
            WHERE t.listing_id = l.id
            AND t.tags IN (:conditions)
        )
    )

    AND (
        :department IS NULL OR EXISTS (
            SELECT 1 FROM listing_tags t
            WHERE t.listing_id = l.id
            AND t.tags IN (:department)
        )
    )
    """, nativeQuery = true)
    List<Listing> filterDynamic(
            @Param("minPrice") Long minPrice,
            @Param("maxPrice") Long maxPrice,
            @Param("conditions") List<String> conditions,
            @Param("department") String department);

}
