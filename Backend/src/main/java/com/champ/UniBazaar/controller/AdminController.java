package com.champ.UniBazaar.controller;

import com.champ.UniBazaar.dto.RequestDto.AppealDto;
import com.champ.UniBazaar.dto.RequestDto.ReportResolveDto;
import com.champ.UniBazaar.dto.ResponseDto.*;
import com.champ.UniBazaar.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/listings")
    public ResponseEntity<List<AdminListingDto>> getAllListings() {
        return ResponseEntity.ok(adminService.getAllListings());
    }

    @GetMapping("/reports")
    public ResponseEntity<List<AdminReportDto>> getAllReports() {
        return ResponseEntity.ok(adminService.getAllReports());
    }

    @GetMapping("/id-cards")
    public ResponseEntity<List<AdminIdCardDto>> getAllIdCards() {
        return ResponseEntity.ok(adminService.getAllIdCards());
    }

    @GetMapping("/stats")
    public ResponseEntity<StatsDto> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDto>> getAllUsers(){
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PatchMapping("/users/{userId}/ban")
    public ResponseEntity<Void> banUser(@PathVariable Long userId) throws Exception {
        adminService.banUser(userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/users/{userId}/unban")
    public ResponseEntity<Void> unBanUser(@PathVariable Long userId){
        adminService.unBanUser(userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/listings/{listingId}/block")
    public ResponseEntity<Void> blockListing(@PathVariable Long listingId) throws Exception {
        adminService.blockListing(listingId);
        return  new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/reports/{reportId}/resolve")
    public ResponseEntity<Void> resolveReport(@PathVariable Long reportId, @RequestBody
    ReportResolveDto dto) throws Exception {
        adminService.resolveReport(reportId, dto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("id-cards/{cardId}/verify")
    public ResponseEntity<Void> approveIdCard(@PathVariable Long cardId, @RequestParam String decision) throws Exception {
        adminService.approveIdCard(cardId,decision);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/appeal/resolve")
    public ResponseEntity<Void> resolveAppeal(@RequestBody AppealDto appealDto) throws Exception {
        adminService.resolveAppeal(appealDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
