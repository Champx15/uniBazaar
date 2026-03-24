package com.champ.UniBazaar.entity;

import com.champ.UniBazaar.enums.ListingStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name="listings")
@NoArgsConstructor
@Getter
@Setter
public class Listing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private BigDecimal price;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    @ElementCollection
    private List<String> imageUrls;
//    private Boolean available;
    @ElementCollection
    private List<String> tags;
    @CreationTimestamp
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    @Enumerated(value = EnumType.STRING)
    private ListingStatus status = ListingStatus.ACTIVE;
    @ManyToOne
    @JoinColumn(name="user_id")
    @JsonBackReference
    private User user;

    public Listing(BigDecimal price, String title, String description, List<String> imageUrls, List<String> tags,User user) {
        this.price = price;
        this.title = title;
        this.description = description;
        this.imageUrls = imageUrls;
//        this.available = available;
        this.tags=tags;
        this.user = user;
    }

}
