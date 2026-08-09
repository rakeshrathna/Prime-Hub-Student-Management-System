package com.student.management_system.dto;

import lombok.Data;

@Data
public class AnnouncementRequest {
    private Long teacherId;
    private String title;
    private String content;
}