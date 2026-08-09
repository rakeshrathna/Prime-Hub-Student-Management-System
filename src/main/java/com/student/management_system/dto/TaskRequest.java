package com.student.management_system.dto;

import com.student.management_system.entity.Task;
import lombok.Data;
import java.time.LocalDate; // ✅ FIXED: was LocalDateTime

@Data
public class TaskRequest {
    private Long teacherId; // used by TaskService.createTask()
    private Long createdByUserId; // ✅ ADDED: frontend sends this field too
    private String title;
    private String description;
    private Task.Priority priority;
    private Task.TaskType taskType;
    private LocalDate dueDate; // ✅ FIXED: was LocalDateTime
}