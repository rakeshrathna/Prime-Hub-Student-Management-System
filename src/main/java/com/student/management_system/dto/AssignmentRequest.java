package com.student.management_system.dto;

import lombok.Data;
import java.util.List;

@Data
public class AssignmentRequest {
    private Long taskId;
    private List<Long> studentIds; // Used for Student assignments
    private Long teamId; // Used for Team assignments
}