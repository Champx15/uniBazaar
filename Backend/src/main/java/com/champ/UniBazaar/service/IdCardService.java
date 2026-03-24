package com.champ.UniBazaar.service;

import com.champ.UniBazaar.dto.RequestDto.IdCardDto;
import com.champ.UniBazaar.entity.IdCard;
import com.champ.UniBazaar.entity.User;
import com.champ.UniBazaar.repo.IdCardRepo;
import com.champ.UniBazaar.repo.ProfileRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IdCardService {
    @Autowired private IdCardRepo idCardRepo;
    @Autowired private ProfileRepo profileRepo;

    public void uploadIdCard(Long userId, IdCardDto dto){
        User user = profileRepo.findById(userId).orElseThrow(() -> new RuntimeException("User doesn't exist"));
        if(!dto.getIdCardUrl().isEmpty()) {
            IdCard idCard = idCardRepo.findByUser_Id(userId).orElse(null);
            if (idCard != null) {
                idCard.setIdCardUrl(dto.getIdCardUrl());
                idCard.setStatus("PENDING");
            } else idCard = new IdCard(user, dto.getIdCardUrl());
            idCardRepo.save(idCard);
        }

        if(dto.getEnrollmentNo()!=null){
            user.setEnrollmentNo(dto.getEnrollmentNo());
            profileRepo.save(user);
        }
    }
}
