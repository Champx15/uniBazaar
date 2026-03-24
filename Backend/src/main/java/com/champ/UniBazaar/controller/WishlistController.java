package com.champ.UniBazaar.controller;

import com.champ.UniBazaar.entity.Listing;
import com.champ.UniBazaar.entity.Wishlist;
import com.champ.UniBazaar.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
public class WishlistController {
    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<Listing>> getWishlistListings(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<Listing> listings = wishlistService.getListings(userId);
        return ResponseEntity.ok(listings);
    }

    @PostMapping("/{listingId}")
    public ResponseEntity<HttpStatus> addWishlistListing(Authentication authentication, @PathVariable Long listingId) {
        Long userId = Long.parseLong(authentication.getName());
        Wishlist wishlist = wishlistService.addListing(userId, listingId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/{listingId}")
    public ResponseEntity<HttpStatus> removeWishlistListing(Authentication authentication, @PathVariable Long listingId) {
        Long userId = Long.parseLong(authentication.getName());
        wishlistService.removeListing(userId,listingId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
