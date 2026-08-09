package com.student.management_system.service;

import com.student.management_system.entity.TaskAssignment;
import com.student.management_system.repository.TaskAssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskAssignmentService {

    @Autowired
    private TaskAssignmentRepository assignmentRepository;

    // Logic: Student marks work as done
    public TaskAssignment submitWork(Long assignmentId, String submissionText) {
        TaskAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with ID: " + assignmentId));
        if (assignment.getScore() != null) {
            throw new RuntimeException("Cannot re-submit an assignment that has already been graded!");
        }
        assignment.setStatus(TaskAssignment.AssignmentStatus.COMPLETED);
        assignment.setSubmissionDate(LocalDateTime.now());
        assignment.setSubmissionText(submissionText); // ✅ ADD
        return assignmentRepository.save(assignment);
    }

    // Logic: Teacher grades the work
    public TaskAssignment gradeWork(Long assignmentId, Integer score, String feedback) {
        TaskAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        assignment.setScore(score);
        assignment.setFeedback(feedback);
        // If your Enum has a GRADED status, set it here.

        return assignmentRepository.save(assignment);
    }

    // Logic: Get tasks for a specific student's dashboard
    public List<TaskAssignment> getStudentAssignments(Long studentId) {
        // This relies on your Repository having the findByStudent_UserId method
        return assignmentRepository.findByStudent_UserId(studentId);
    }

    public List<TaskAssignment> getTeacherAssignments(Long teacherId) {
        return assignmentRepository.findByTask_CreatedBy_UserId(teacherId);
    }

}