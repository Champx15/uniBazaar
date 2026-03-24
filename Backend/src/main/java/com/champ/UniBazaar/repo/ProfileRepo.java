package com.champ.UniBazaar.repo;

import com.champ.UniBazaar.entity.User;
import com.champ.UniBazaar.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProfileRepo extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEnrollmentNoAndEmail(Long enrollmentNo, String email);
    boolean existsByEnrollmentNo(Long enrollmentNo);

    Long countByStatus(UserStatus status);
    Long countByStatusIn(List<UserStatus> statuses);
}
