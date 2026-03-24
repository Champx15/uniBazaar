package com.champ.UniBazaar.controller;

import com.champ.UniBazaar.dto.RequestDto.UpdateListingDto;
import com.champ.UniBazaar.dto.ResponseDto.CursorResponse;
import com.champ.UniBazaar.dto.ResponseDto.ExploreResponseDto;
import com.champ.UniBazaar.dto.RequestDto.ListingRequestDto;
import com.champ.UniBazaar.dto.ResponseDto.ListingResponseDto;
import com.champ.UniBazaar.dto.ResponseDto.PagedResponse;
import com.champ.UniBazaar.entity.Listing;
import com.champ.UniBazaar.service.ListingService;
import com.champ.UniBazaar.enums.ListingStatus;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/listings")
public class ListingController {

    @Autowired private ListingService listingService;

//    @GetMapping
//    public ResponseEntity<PagedResponse<ExploreResponseDto>> getListings(
//            Authentication authentication,
//            Pageable pageable
//    ) {
//        Long userId = Long.parseLong(authentication.getName());
//
//        Page<ExploreResponseDto> page =
//                listingService.fetchListings(userId, pageable);
//
//        PagedResponse<ExploreResponseDto> response =
//                new PagedResponse<>(
//                        page.getContent(),
//                        page.getNumber(),
//                        page.getSize(),
//                        page.getTotalElements(),
//                        page.getTotalPages()
//                );
//
//        return ResponseEntity.ok(response);
//    }
    @GetMapping
    public ResponseEntity<CursorResponse<ExploreResponseDto>> getListings(
            Authentication authentication,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(required = false) String cursorCreatedAt
    ) {
        Instant createdAtInstant = null;
        if (cursorCreatedAt != null && !cursorCreatedAt.isEmpty() && !"null".equals(cursorCreatedAt)) {
            createdAtInstant = Instant.parse(cursorCreatedAt);
        }
        Long userId=null;
        if(authentication!=null && authentication.isAuthenticated()){
         userId = Long.parseLong(authentication.getName());
        }
        CursorResponse<ExploreResponseDto> response = listingService.fetchListings(userId, cursorId, createdAtInstant);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Listing>> getListingsByUserId(Authentication authentication){
        Long userId = Long.parseLong(authentication.getName());
        List<Listing> listings = listingService.fetchAllByUserId(userId);
        return new ResponseEntity<>(listings,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingResponseDto> getById(@PathVariable Long id,Authentication authentication){
        boolean visitor = authentication == null;
        ListingResponseDto responseDto = listingService.fetchById(id,visitor);
        return new ResponseEntity<>(responseDto,HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Listing> addListing(@Valid @RequestBody ListingRequestDto requestDto, Authentication authentication){
        Long userId = Long.parseLong(authentication.getName());
        Listing listing = listingService.createListing(requestDto.getPrice(), requestDto.getTitle(), requestDto.getDescription(), requestDto.getImageUrls(), requestDto.getTags(),userId);
        return ResponseEntity.ok(listing);
    }

    @PreAuthorize("@listingSecurity.isOwner(#id,authentication.name)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeListing(@PathVariable Long id){
        listingService.removeListing(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize("@listingSecurity.isOwner(#id,authentication.name)")
    @PatchMapping("/{id}")
    public ResponseEntity<Listing> editListing(@PathVariable Long id,@Valid @RequestBody UpdateListingDto updateDto){
        Listing listing = listingService.editListing(id,updateDto);
        return new ResponseEntity<>(listing,HttpStatus.OK);
    }

    @PreAuthorize("@listingSecurity.isOwner(#id,authentication.name)")
    @PatchMapping("/availability/{id}")
    public ResponseEntity<Void> editAvailability(@PathVariable Long id,@RequestParam ListingStatus status){
        listingService.editAvailability(id,status);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String title){
        List<Listing> search = listingService.search(title);
        return new ResponseEntity<>(search,HttpStatus.OK);
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filter(@RequestParam Long minPrice, @RequestParam Long maxPrice,  @RequestParam(required = false) String condition, @RequestParam(required = false) String department){
       List<Listing> filter = listingService.filter(minPrice,maxPrice,condition,department);
       return new ResponseEntity<>(filter,HttpStatus.OK);
    }


}
