package com.student.management_system.repository;

import com.student.management_system.entity.TaskAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, Long> {

    // 1. For Student Dashboard: Individual assignments
    List<TaskAssignment> findByStudent_UserId(Long studentId);

    // 2. For Student Dashboard: Team-based assignments
    List<TaskAssignment> findByTeam_TeamId(Long teamId);

    // 3. For Teacher Dashboard: View by Task
    List<TaskAssignment> findByTask_TaskId(Long taskId);

    // 4. NEW: For Teacher Dashboard: See all assignments created by a specific
    // teacher
    // This allows the teacher to see everything they need to grade in one list
    List<TaskAssignment> findByTask_CreatedBy_UserId(Long teacherId);

    // 5. For Analytics
    long countByStudent_UserIdAndStatus(Long studentId, TaskAssignment.AssignmentStatus status);

    // 6. Find specific link between student and task
    Optional<TaskAssignment> findByStudent_UserIdAndTask_TaskId(Long studentId, Long taskId);

    void deleteAllByTask_TaskId(Long taskId);
}