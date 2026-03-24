package com.champ.UniBazaar.repo;

import com.champ.UniBazaar.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepo extends JpaRepository<Report, Long> {
    Long countByStatus(String status);
}
