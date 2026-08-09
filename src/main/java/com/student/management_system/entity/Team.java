package com.student.management_system.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "teams")
@Data
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long teamId;

    @Column(nullable = false)
    private String teamName;

    @ManyToOne
    @JoinColumn(name = "created_by_user_id", nullable = false)
    @JsonIgnoreProperties({ "password", "phoneNumber", "role" }) // Clean up the JSON
    private User createdBy;

    @ManyToMany
    @JoinTable(name = "team_members", joinColumns = @JoinColumn(name = "team_id"), inverseJoinColumns = @JoinColumn(name = "student_user_id"))
    // CRITICAL: Stop the recursion so React doesn't crash when loading team members
    @JsonIgnoreProperties({ "password", "phoneNumber" })
    private List<User> members;

    private LocalDateTime createdAt = LocalDateTime.now();
}