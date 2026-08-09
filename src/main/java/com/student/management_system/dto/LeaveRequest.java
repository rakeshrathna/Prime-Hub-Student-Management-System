package com.student.management_system.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class LeaveRequest {
    private Long studentId;
    private String reason;
    private LocalDate startDate;
    private LocalDate endDate;
}