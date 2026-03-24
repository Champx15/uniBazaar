package com.champ.UniBazaar.service;

import com.champ.UniBazaar.entity.Listing;
import com.champ.UniBazaar.entity.User;
import com.champ.UniBazaar.entity.Wishlist;
import com.champ.UniBazaar.repo.ListingRepo;
import com.champ.UniBazaar.repo.ProfileRepo;
import com.champ.UniBazaar.repo.WishlistRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class WishlistService {
    @Autowired private WishlistRepo wishlistRepo;
    @Autowired private ProfileRepo profileRepo;
    @Autowired private ListingRepo listingRepo;

    public List<Listing> getListings(Long userId){
        Optional<Wishlist> byUserId = wishlistRepo.findByUserId(userId);
        if(byUserId.isPresent()){
            return byUserId.get().getListings();
        }
        throw  new RuntimeException("Wishlist doesn't exist");
    }

    public Wishlist addListing(Long userId, Long listingId){
        User user = profileRepo.findById(userId).orElseThrow(() -> new RuntimeException("User doesn't exist"));
        Listing listing = listingRepo.findById(listingId).orElseThrow(() -> new RuntimeException("Listing doesn't exist"));
        Wishlist wishlist = wishlistRepo.findByUserId(userId).orElseGet(() -> new Wishlist(user));
        if (!wishlist.getListings().contains(listing)) {
            wishlist.addListing(listing);
        }
        return wishlistRepo.save(wishlist);
    }

    public void removeListing(Long userId, Long listingId){
        Listing listing = listingRepo.findById(listingId).orElseThrow(() -> new RuntimeException("Listing doesn't exist"));
        Wishlist wishlist = wishlistRepo.findByUserId(userId).orElseThrow(() -> new RuntimeException("Wishlist doesn't exist"));
        wishlist.removeListing(listing);
        wishlistRepo.save(wishlist);
    }

    public Set<Long> getWishlistIds(Long userId){
       return  wishlistRepo.findListingIdsByUserId(userId).orElse(Collections.emptySet());
    }
}
