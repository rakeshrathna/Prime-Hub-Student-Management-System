package com.student.management_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "task_assignments")
@Data
public class TaskAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assignmentId;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "task_id")
    @JsonIgnoreProperties({ "createdBy", "createdAt" })
    private Task task;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_user_id")
    @JsonIgnoreProperties({ "password", "phoneNumber", "profileImageUrl" })
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_id")
    @JsonIgnoreProperties({ "members", "createdBy", "createdAt" })
    private Team team;
    @Enumerated(EnumType.STRING)
    private AssignmentStatus status = AssignmentStatus.PENDING;

    private LocalDateTime submissionDate;

    private Integer score;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(columnDefinition = "TEXT")
    private String submissionText;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "evaluated_by_user_id")
    @JsonIgnoreProperties({ "password", "phoneNumber", "profileImageUrl" })
    private User evaluatedBy;

    public enum AssignmentStatus {
        PENDING,
        COMPLETED
    }
}