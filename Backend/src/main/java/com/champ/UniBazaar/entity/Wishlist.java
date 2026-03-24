package com.champ.UniBazaar.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "wishlists")
@NoArgsConstructor
@Getter
@Setter
public class Wishlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(optional = false)
    @JsonIgnore
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    @ManyToMany
    @JoinTable(
            name = "wishlist_listings",
            joinColumns = @JoinColumn(name = "wishlist_id"),
            inverseJoinColumns = @JoinColumn(name = "listing_id")
    )
    private List<Listing> listings = new ArrayList<>();

    public Wishlist(User user){
        this.user=user;
        this.listings = new ArrayList<>();
    }

    public void addListing(Listing listing) {
        this.listings.add(listing);
    }

    public void removeListing(Listing listing) {
        this.listings.remove(listing);
    }
}
