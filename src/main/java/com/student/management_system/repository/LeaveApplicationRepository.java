package com.student.management_system.repository;

import com.student.management_system.entity.LeaveApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeaveApplicationRepository extends JpaRepository<LeaveApplication, Long> {
    List<LeaveApplication> findByStudent_UserId(Long studentId);

    // Teachers need to see all PENDING requests
    List<LeaveApplication> findByStatus(LeaveApplication.LeaveStatus status);
}