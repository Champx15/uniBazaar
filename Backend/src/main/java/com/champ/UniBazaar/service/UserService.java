package com.champ.UniBazaar.service;

import com.champ.UniBazaar.dto.RequestDto.FeedbackDto;
import com.champ.UniBazaar.dto.RequestDto.ProfileUpdateDto;
import com.champ.UniBazaar.entity.User;
import com.champ.UniBazaar.enums.UserStatus;
import com.champ.UniBazaar.repo.ProfileRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private ProfileRepo profileRepo;
    @Autowired
    private EmailService emailService;

    public User get(Long userId){
        return profileRepo.findById(userId).orElseThrow(() -> new RuntimeException("User doesn't exist"));
    }

    public void delete(Long userId) {
        User user = profileRepo.findById(userId).orElseThrow(() -> new RuntimeException("User doesn't exist"));
        user.setStatus(UserStatus.INACTIVE);
       profileRepo.save(user);
    }

    public void update(ProfileUpdateDto updateDto, Long userId) {
        User user = profileRepo.findById(userId).orElseThrow(() -> new RuntimeException("User doesn't exist"));
       String dtoName = updateDto.getName();
       String dtoPfImageUrl  = updateDto.getPfImageUrl();
        if(dtoName!=null) user.setName(dtoName);
        if(dtoPfImageUrl!=null) user.setPfImageUrl(dtoPfImageUrl);
        profileRepo.save(user);
    }

    public void feedback(Long userId, FeedbackDto dto) throws Exception {
        User user = profileRepo.findById(userId).orElseThrow(() -> new RuntimeException("User doesn't exist"));
        emailService.sendFeedbackEmail(user.getEmail(),user.getName(),dto.getFeedback());
    }


}
