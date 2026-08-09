package com.student.management_system.controller;

import com.student.management_system.entity.Task;
import com.student.management_system.entity.TaskAssignment;
import com.student.management_system.service.TaskService;
import com.student.management_system.service.TaskAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.student.management_system.dto.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskAssignmentService taskAssignmentService;

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @PostMapping("/create")
    public Task createTask(@RequestBody TaskRequest request) {
        return taskService.createTask(request);
    }

    @PostMapping("/assign/students")
    public String assignToStudents(@RequestBody AssignmentRequest request) {
        taskService.assignToStudents(request.getTaskId(), request.getStudentIds());
        return "Task assigned successfully.";
    }

    @PostMapping("/assign/team")
    public String assignToTeam(@RequestBody AssignmentRequest request) {
        taskService.assignToTeam(request.getTaskId(), request.getTeamId());
        return "Task assigned to team successfully.";
    }

    @PostMapping("/submit/{assignmentId}")
    public String submitTask(@PathVariable Long assignmentId) {
        taskService.submitTaskByAssignmentId(assignmentId);
        return "Task submitted successfully.";
    }

    @PostMapping("/grade")
    public String gradeTask(
            @RequestParam Long teacherId,
            @RequestParam Long taskId,
            @RequestParam Long studentId,
            @RequestParam int score,
            @RequestParam String feedback) {

        taskService.gradeTask(teacherId, taskId, studentId, score, feedback);
        return "Task graded successfully.";
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/teacher/{teacherId}/assignments")
    public List<TaskAssignment> getTeacherAssignments(@PathVariable Long teacherId) {
        return taskAssignmentService.getTeacherAssignments(teacherId); // Assuming you wire this through TaskService or
                                                                       // inject
        // TaskAssignmentService directly
    }

    @GetMapping("/teacher/{teacherId}")
    public List<Task> getTasksByTeacher(@PathVariable Long teacherId) {
        return taskService.getTasksByTeacher(teacherId);
    }

    @PatchMapping("/assignments/{assignmentId}")
    public ResponseEntity<String> patchScore(
            @PathVariable Long assignmentId,
            @RequestBody ScoreRequest request) {
        taskService.patchScore(assignmentId, request.getScore());
        return ResponseEntity.ok("Score updated.");
    }

    // ✅ ADD — inner class for PATCH body
    public static class ScoreRequest {
        private Integer score;

        public Integer getScore() {
            return score;
        }

        public void setScore(Integer score) {
            this.score = score;
        }
    }
}