package com.champ.UniBazaar.repo;

import com.champ.UniBazaar.entity.IdCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IdCardRepo extends JpaRepository<IdCard, Long> {
    Long countByStatus(String status);
    public Optional<IdCard> findByUser_Id(Long userId);
}
