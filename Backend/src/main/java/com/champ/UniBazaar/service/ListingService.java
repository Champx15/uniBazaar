package com.champ.UniBazaar.service;

import com.champ.UniBazaar.dto.RequestDto.UpdateListingDto;
import com.champ.UniBazaar.dto.ResponseDto.*;
import com.champ.UniBazaar.dto.RequestDto.ListingRequestDto;
import com.champ.UniBazaar.entity.Listing;
import com.champ.UniBazaar.entity.User;
import com.champ.UniBazaar.enums.ListingStatus;
import com.champ.UniBazaar.enums.UserStatus;
import com.champ.UniBazaar.repo.ListingRepo;
import com.champ.UniBazaar.repo.ProfileRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Service
public class ListingService {
    @Autowired
    private ListingRepo listingRepo;
    @Autowired
    private ProfileRepo profileRepo;
    @Autowired
    private WishlistService wishlistService;

    //    public Page<ExploreResponseDto> fetchListings(Long userId, Pageable pageable){
//        Page<Listing> availableListings = listingRepo.findByStatusAndUser_Status(ListingStatus.ACTIVE, UserStatus.ACTIVE,pageable);
//        Set<Long> wishlistIds = wishlistService.getWishlistIds(userId);
//        List<ExploreResponseDto> response = new ArrayList<>();
//        return availableListings
//                .map(listing ->
//                        new ExploreResponseDto(
//                                listing,
//                                wishlistIds.contains(listing.getId())
//                        )
//                );
//    }
    public CursorResponse<ExploreResponseDto> fetchListings(Long userId, Long cursorId, Instant cursorCreatedAt) {
        PageRequest pageRequest = PageRequest.of(0, 13);
        List<Listing> exploreCursor = listingRepo.getExploreCursor(cursorCreatedAt, cursorId, pageRequest);
            Set<Long> wishlistIds = wishlistService.getWishlistIds(userId);
             List<ExploreResponseDto> explore = new ArrayList<>(exploreCursor.stream().map(
                    listing -> {
                        return new ExploreResponseDto(listing, wishlistIds.contains(listing.getId()));
                    }
            ).toList());
        boolean hasNext = explore.size() > 12;
        if (hasNext) explore.remove(12);
        cursorId = null;
        cursorCreatedAt = null;
        if (!explore.isEmpty()) {
            cursorId = explore.getLast().getListing().getId();
            cursorCreatedAt = explore.getLast().getListing().getCreatedAt();

        }
        return new CursorResponse<>(explore, cursorId, cursorCreatedAt, hasNext);

    }

    public Listing createListing(BigDecimal price, String title, String description, List<String> imageUrls, List<String> tags, Long id) {
        User user = profileRepo.findById(id).orElseThrow(() -> new UsernameNotFoundException("User doesn't exists"));
        Listing listing = new Listing(price, title, description, imageUrls, tags, user);
        return listingRepo.save(listing);
    }


    public ListingResponseDto fetchById(Long id, boolean visitor) {
        Listing listingById = listingRepo.findByIdAndStatusNot(id, ListingStatus.BLOCKED);
        if(visitor) {
            return new ListingResponseDto(listingById,null,listingById.getUser().getName(),null);
        }
        Long userId = listingById.getUser().getId();
        String name = listingById.getUser().getName();
        String pfImageUrl = listingById.getUser().getPfImageUrl();
        return new ListingResponseDto(listingById, userId, name, pfImageUrl);
    }

    public List<Listing> fetchAllByUserId(Long userId) {
//        return listingRepo.findByUserId(userId);
        List<ListingStatus> statuses = new ArrayList<>(List.of(ListingStatus.ACTIVE, ListingStatus.SOLD));
        return listingRepo.findByUserIdAndStatusIn(userId, statuses);
    }

    public void removeListing(Long id) {
//        listingRepo.deleteById(id);
        Listing listing = listingRepo.findById(id).orElseThrow(() -> new RuntimeException("Listing doesn't exits"));
        listing.setStatus(ListingStatus.DELETED);
        listingRepo.save(listing);
    }

    public Listing editListing(Long id, UpdateListingDto dto) {
        Listing listing = listingRepo.findById(id).orElseThrow(() -> new RuntimeException("Listing doesn't exist"));
        if (dto.getPrice() != null) {
            listing.setPrice(dto.getPrice());
        }

        if (dto.getTitle() != null) {
            listing.setTitle(dto.getTitle());
        }

        if (dto.getDescription() != null) {
            listing.setDescription(dto.getDescription());
        }

        if (dto.getImageUrls() != null) {
            listing.setImageUrls(dto.getImageUrls());
        }

        if (dto.getTags() != null) {
            listing.setTags(dto.getTags());
        }
        return listingRepo.save(listing);
    }

    public void editAvailability(Long id, ListingStatus status) {
        Listing listing = listingRepo.findById(id).orElseThrow(() -> new RuntimeException("Listing doesn't exits"));
        listing.setStatus(status);
//        listing.setAvailable(available);
        listingRepo.save(listing);
    }

    public List<Listing> search(String title){
       return  listingRepo.findByTitleContainingIgnoreCase(title);
    }

    public List<Listing> filter(Long minPrice, Long maxPrice, String condition, String department){
        List<String> conditions = new ArrayList<>();
        if(condition.contains(",")){
            String[] split = condition.trim().split(",");
            System.out.println(Arrays.toString(split));
            conditions.addAll(Arrays.asList(split));
        }
//        if(department!=null) tags.add(department);
//        if(!tags.isEmpty())  return listingRepo.filter(minPrice, maxPrice, tags, tags.size());
//        return listingRepo.filterByPriceOnly(minPrice,maxPrice);
        return listingRepo.filterDynamic(minPrice,maxPrice,conditions,department);
    }

}
