package com.champ.UniBazaar.controller;

import com.champ.UniBazaar.dto.RequestDto.ReportDto;
import com.champ.UniBazaar.entity.Report;
import com.champ.UniBazaar.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/report")
public class ReportController {

    @Autowired private ReportService reportService;

    @PostMapping("/user/{reportedUserId}")
    public ResponseEntity<Void> addUserReport(@RequestBody ReportDto dto, Authentication authentication, @PathVariable Long reportedUserId){
            Long reporterId = Long.parseLong(authentication.getName());
        Report report = reportService.addUserReport(dto, reporterId,reportedUserId);
        if(report!=null) return new ResponseEntity<>(HttpStatus.CREATED);
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @PostMapping("/listing/{reportedListingId}")
    public ResponseEntity<Void> addListingReport(@RequestBody ReportDto dto, Authentication authentication,@PathVariable Long reportedListingId){
            Long reporterId = Long.parseLong(authentication.getName());
        Report report = reportService.addListingReport(dto, reporterId,reportedListingId);
        if(report!=null) return new ResponseEntity<>(HttpStatus.CREATED);
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }


}
