package com.student.management_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate; // ✅ FIXED: was LocalDateTime
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private TaskType taskType;

    private LocalDate dueDate; // ✅ FIXED: was LocalDateTime — frontend sends "yyyy-MM-dd"

    @ManyToOne
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdBy;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Priority {
        NORMAL, MEDIUM, HIGH
    }

    public enum TaskType {
        INDIVIDUAL, TEAM
    }
}