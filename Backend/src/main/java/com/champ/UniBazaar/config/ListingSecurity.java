package com.champ.UniBazaar.config;

import com.champ.UniBazaar.repo.ListingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ListingSecurity {
    @Autowired private ListingRepo listingRepo;
    public boolean isOwner(Long id, String userId){
        return listingRepo.existsByIdAndUser_Id(id,Long.valueOf(userId));
    }
}
