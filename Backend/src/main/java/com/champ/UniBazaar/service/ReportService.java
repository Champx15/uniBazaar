package com.champ.UniBazaar.service;

import com.champ.UniBazaar.dto.RequestDto.ReportDto;
import com.champ.UniBazaar.entity.Listing;
import com.champ.UniBazaar.entity.Report;
import com.champ.UniBazaar.entity.User;
import com.champ.UniBazaar.repo.ListingRepo;
import com.champ.UniBazaar.repo.ProfileRepo;
import com.champ.UniBazaar.repo.ReportRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReportService {
    @Autowired private ProfileRepo profileRepo;
    @Autowired private ReportRepo reportRepo;
    @Autowired private ListingRepo listingRepo;

    public Report addUserReport(ReportDto dto, Long reporterId,Long reportedUserId){
        User reporter = profileRepo.findById(reporterId).orElseThrow(() -> new RuntimeException("User doesn't exists"));
        User reportedUser = profileRepo.findById(reportedUserId).orElseThrow(() -> new RuntimeException("User doesn't exits"));
        Report report = new Report(reporter, reportedUser, null, dto.getReason(), dto.getDescription());
        return reportRepo.save(report);
    }
    public Report addListingReport(ReportDto dto, Long reporterId, Long reportedListingId){
        User reporter = profileRepo.findById(reporterId).orElseThrow(() -> new RuntimeException("User doesn't exists"));
        Listing reportedListing = listingRepo.findById(reportedListingId).orElseThrow(() -> new RuntimeException("Listing doesn't exist"));
        Report report = new Report(reporter, null, reportedListing, dto.getReason(), dto.getDescription());
        return reportRepo.save(report);
    }
}
