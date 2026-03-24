package com.champ.UniBazaar.service;

import com.champ.UniBazaar.dto.RequestDto.AppealDto;
import com.champ.UniBazaar.dto.RequestDto.ReportResolveDto;
import com.champ.UniBazaar.dto.ResponseDto.*;
import com.champ.UniBazaar.entity.IdCard;
import com.champ.UniBazaar.entity.Listing;
import com.champ.UniBazaar.entity.Report;
import com.champ.UniBazaar.entity.User;
import com.champ.UniBazaar.enums.ListingStatus;
import com.champ.UniBazaar.enums.UserStatus;
import com.champ.UniBazaar.repo.IdCardRepo;
import com.champ.UniBazaar.repo.ListingRepo;
import com.champ.UniBazaar.repo.ProfileRepo;
import com.champ.UniBazaar.repo.ReportRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class AdminService {
    @Autowired
    private ListingRepo listingRepo;
    @Autowired
    private ReportRepo reportRepo;
    @Autowired
    private IdCardRepo idCardRepo;
    @Autowired
    private ProfileRepo profileRepo;
    @Autowired
    private UserBlacklistService userBlacklistService;
    @Autowired
    private EmailService emailService;


    public List<AdminListingDto> getAllListings() {
        return listingRepo.findAll().stream().map(
                listing -> {
                    return new AdminListingDto(listing, listing.getUser().getEmail());
                }
        ).toList();
    }

    public List<AdminReportDto> getAllReports() {
        return reportRepo.findAll()
                .stream().filter( report -> report.getStatus().equals("PENDING"))
                .map(report -> {
                    User ru = report.getReportedUser();

                    Long id = ru != null ? ru.getId() : null;
                    String email = ru != null ? ru.getEmail() : null;

                    return new AdminReportDto(
                            report.getId(),
                            report.getReporter().getId(),
                            report.getReportedListing(),
                            id,
                            email,
                            report.getReason(),
                            report.getDescription(),
                            report.getStatus()
                    );
                })
                .toList();
    }

    public List<AdminIdCardDto> getAllIdCards() {
        return idCardRepo.findAll().stream().filter(card -> card.getStatus().equals("PENDING"))
                .map(
                        card -> {
                            return new AdminIdCardDto(card.getId(),card.getUser().getId(),card.getUser().getName(),card.getUser().getEmail(),card.getUser().getEnrollmentNo(),card.getCreatedAt(),card.getIdCardUrl());
                        }
                ).toList();
    }

    public List<AdminUserDto> getAllUsers() {
        List<User> allUsers = profileRepo.findAll();
        return allUsers.stream().map(user -> {
            Integer listingsLength = user.getListings().size();
            return new AdminUserDto(user, listingsLength);
        }).toList();
    }

    public StatsDto getStats() {
        Long totalUsers = profileRepo.count();
        List<UserStatus> statuses = new ArrayList<>(List.of(UserStatus.ACTIVE, UserStatus.UNVERIFIED));
        Long activeUsers = profileRepo.countByStatusIn(statuses);
        Long totalListings = listingRepo.count();
        Long pendingReports = reportRepo.countByStatus("PENDING");
        Long pendingVerifications = idCardRepo.countByStatus("PENDING");
        return new StatsDto(totalUsers, activeUsers, totalListings, pendingReports, pendingVerifications);
    }

    public void banUser(Long userId) throws Exception {
        User user = profileRepo.findById(userId).orElseThrow(() -> new RuntimeException("User doesn't exists"));
        user.setStatus(UserStatus.BANNED);
        profileRepo.save(user);
        userBlacklistService.blacklistUser(userId);
        emailService.sendAccountBlockedEmail(user.getEmail(),user.getName());
        log.info("USER_BAN | userId={} |  SUCCESS", userId);
    }

    public void unBanUser(Long userId) {
        User user = profileRepo.findById(userId).orElseThrow(() -> new RuntimeException("User doesn't exits"));
        if (user.getHasEnrollment() && user.getIdCardInfo().getStatus().equals("VERIFIED")) {
            user.setStatus(UserStatus.ACTIVE);
            profileRepo.save(user);
            return;
        }
        user.setStatus(UserStatus.UNVERIFIED);
        profileRepo.save(user);

        if(userBlacklistService.isBlacklisted(userId)){
            userBlacklistService.removeFromBlocklist(userId);
        }

    }

    public void blockListing(Long listingId) throws Exception {
        Listing listing = listingRepo.findById(listingId).orElseThrow(() -> new RuntimeException("Listing doesn't exist"));
        Long blockedListings = listingRepo.countByStatusAndUser_Id(ListingStatus.BLOCKED, listing.getUser().getId());
        if(blockedListings>2){
            banUser(listing.getUser().getId());
            return;
        }
        listing.setStatus(ListingStatus.BLOCKED);
        listingRepo.save(listing);
        List<String> tags = listing.getTags();
        String sendTags = String.join(",  ",tags);
        emailService.sendListingBlockedEmail(listing.getUser().getEmail(),listing.getUser().getName(),listing.getTitle(),listing.getDescription(),listing.getPrice().toString(),sendTags);
    }

    public void resolveReport(Long reportId, ReportResolveDto dto) throws Exception {
        Report report = reportRepo.findById(reportId).orElseThrow(() -> new RuntimeException("Report doesn't exits"));
        if (dto.getResolution().equals("REJECTED")) {
            report.setStatus("REJECTED");
            reportRepo.save(report);
        } else {
            if (dto.getType().equals("user")) {
                banUser(dto.getId());
                report.setStatus("RESOLVED");
                reportRepo.save(report);
                return;
            }
            blockListing(dto.getId());
            report.setStatus("RESOLVED");
            reportRepo.save(report);
        }

    }

    public void approveIdCard(Long cardId,String decision) throws Exception {
        IdCard idCard = idCardRepo.findById(cardId).orElseThrow(() -> new RuntimeException("Id Card doesn't exists"));
        if(decision.equals("reject")){
            idCard.setStatus("REJECTED");
            idCardRepo.save(idCard);
            emailService.sendIdVerificationRejected(idCard.getUser().getEmail(),idCard.getUser().getName());
            return;
        }
        idCard.setStatus("VERIFIED");
        idCardRepo.save(idCard);
        User user = idCard.getUser();
        user.setStatus(UserStatus.ACTIVE);
        profileRepo.save(user);
        emailService.sendIdVerificationAccepted(user.getEmail(),user.getName());

    }

    public void resolveAppeal(AppealDto appealDto) throws Exception {
        User user = profileRepo.findByEmail(appealDto.getEmail()).orElseThrow(() -> new RuntimeException("User doesn't exits"));
        if(appealDto.getMethod().equals("reject")){
            emailService.sendAppealRejected(user.getEmail(),user.getName());
            return;
        }
         emailService.sendAppealAccepted(user.getEmail(),user.getName());
         if (user.getHasEnrollment() && user.getIdCardInfo().getStatus().equals("VERIFIED")) {
            user.setStatus(UserStatus.ACTIVE);
            profileRepo.save(user);
            return;
        }
        user.setStatus(UserStatus.UNVERIFIED);
        profileRepo.save(user);


    }

}
