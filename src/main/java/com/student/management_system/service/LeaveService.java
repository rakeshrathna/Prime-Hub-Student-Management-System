package com.student.management_system.service;

import com.student.management_system.entity.LeaveApplication;
import com.student.management_system.entity.User;
import com.student.management_system.repository.LeaveApplicationRepository;
import com.student.management_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Added for best practice
import com.student.management_system.dto.LeaveRequest;
import java.util.List;

@Service
public class LeaveService {

    @Autowired
    private LeaveApplicationRepository leaveRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional // Ensures the database transaction is safe
    public LeaveApplication applyForLeave(LeaveRequest request) {
        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + request.getStudentId()));

        LeaveApplication leave = new LeaveApplication();
        leave.setStudent(student);
        leave.setReason(request.getReason());
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());
        leave.setStatus(LeaveApplication.LeaveStatus.PENDING);

        return leaveRepository.save(leave);
    }

    // TEACHER VIEW: See what needs approval
    public List<LeaveApplication> getPendingLeaves() {
        return leaveRepository.findByStatus(LeaveApplication.LeaveStatus.PENDING);
    }

    // STUDENT VIEW: See history of all requests (Step 2 logic)
    public List<LeaveApplication> getStudentLeaves(Long studentId) {
        return leaveRepository.findByStudent_UserId(studentId);
    }

    @Transactional
    public LeaveApplication updateLeaveStatus(Long leaveId, LeaveApplication.LeaveStatus newStatus) {
        LeaveApplication leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave application not found with ID: " + leaveId));

        leave.setStatus(newStatus);
        return leaveRepository.save(leave);
    }
}