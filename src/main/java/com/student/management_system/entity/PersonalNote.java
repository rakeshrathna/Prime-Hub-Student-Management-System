package com.student.management_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "personal_notes")
@Data
public class PersonalNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long noteId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "teacher_user_id")
    private User teacher;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_user_id")
    private User student;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private LocalDateTime createdAt = LocalDateTime.now();
}