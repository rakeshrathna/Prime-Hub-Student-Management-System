package com.student.management_system.dto;

import lombok.Data;

@Data
public class NoteRequest {
    private Long teacherId;
    private Long studentId;
    private String content;
}