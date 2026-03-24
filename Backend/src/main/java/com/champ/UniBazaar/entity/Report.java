package com.champ.UniBazaar.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name="reports")
@NoArgsConstructor
@Getter
@Setter
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private User reporter;
    @ManyToOne
    @JoinColumn(name = "reported_user_id", nullable = true)
    private User reportedUser;
    @ManyToOne
    @JoinColumn(name = "reported_listing_id", nullable = true)
    private Listing reportedListing;
    private String reason; //
    private String description;
    private String status = "PENDING"; //RESOLVED, PENDING, REJECTED
    @CreationTimestamp
    private Timestamp createdAt;
    @UpdateTimestamp
    private Timestamp updatedAt;

    public Report(User reporter, User reportedUser, Listing reportedListing, String reason, String description){
        this.reporter= reporter;
        this.reportedUser=reportedUser;
        this.reportedListing = reportedListing;
        this.reason=reason;
        this.description=description;
    }

}
