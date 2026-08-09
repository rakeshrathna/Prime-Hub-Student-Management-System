package com.student.management_system.repository;

import com.student.management_system.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
    // Find all teams created by a specific teacher
    List<Team> findByCreatedBy_UserId(Long teacherId);

    // BUGFIX: was Optional<Team>. A student can end up on more than one team
    // (nothing in the teacher UI prevents adding the same student to two
    // teams), and Optional-returning derived queries throw
    // IncorrectResultSizeDataAccessException the moment that happens — which
    // surfaced as the student's "My team" page silently showing nothing.
    List<Team> findByMembers_UserId(Long studentId);
}