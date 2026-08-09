package com.student.management_system.service;

import com.student.management_system.entity.*;
import com.student.management_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.student.management_system.dto.TaskRequest;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private TaskAssignmentRepository assignmentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TeamRepository teamRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task createTask(TaskRequest request) {
        // ✅ FIXED: accept both teacherId and createdByUserId from frontend
        Long userId = request.getTeacherId() != null
                ? request.getTeacherId()
                : request.getCreatedByUserId();

        if (userId == null) {
            throw new RuntimeException("Teacher/Creator ID is required to create a task.");
        }

        User teacher = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());

        // ✅ Set defaults if not provided — prevents null constraint issues
        task.setPriority(request.getPriority() != null ? request.getPriority() : Task.Priority.NORMAL);
        task.setTaskType(request.getTaskType() != null ? request.getTaskType() : Task.TaskType.INDIVIDUAL);
        task.setDueDate(request.getDueDate());
        task.setCreatedBy(teacher);

        return taskRepository.save(task);
    }

    public void assignToStudents(Long taskId, List<Long> studentIds) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        List<User> students = userRepository.findAllById(studentIds);
        for (User student : students) {
            createAssignment(task, student, null);
        }
    }

    public void assignToTeam(Long taskId, Long teamId) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        Team team = teamRepository.findById(teamId).orElseThrow();
        for (User student : team.getMembers()) {
            createAssignment(task, student, team);
        }
    }

    private void createAssignment(Task task, User student, Team team) {
        TaskAssignment assignment = new TaskAssignment();
        assignment.setTask(task);
        assignment.setStudent(student);
        assignment.setTeam(team);
        assignment.setStatus(TaskAssignment.AssignmentStatus.PENDING);
        assignmentRepository.save(assignment);
    }

    public void submitTaskByAssignmentId(Long assignmentId) {
        TaskAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        assignment.setSubmissionDate(LocalDateTime.now());
        assignment.setStatus(TaskAssignment.AssignmentStatus.COMPLETED);
        assignmentRepository.save(assignment);
    }

    public void gradeTask(Long teacherId, Long taskId, Long studentId, int score, String feedback) {
        TaskAssignment assignment = assignmentRepository
                .findByStudent_UserIdAndTask_TaskId(studentId, taskId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        User teacher = userRepository.findById(teacherId).orElseThrow();
        assignment.setScore(score);
        assignment.setFeedback(feedback);
        assignment.setEvaluatedBy(teacher);
        assignmentRepository.save(assignment);
    }

    @Transactional
    public void deleteTask(Long taskId) {
        try {
            assignmentRepository.deleteAllByTask_TaskId(taskId);
            taskRepository.deleteById(taskId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete task: " + e.getMessage());
        }
    }

    public List<Task> getTasksByTeacher(Long teacherId) {
        return taskRepository.findByCreatedBy_UserId(teacherId);
    }

    public void patchScore(Long assignmentId, Integer score) {
        TaskAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found: " + assignmentId));
        assignment.setScore(score);
        assignmentRepository.save(assignment);
    }
}