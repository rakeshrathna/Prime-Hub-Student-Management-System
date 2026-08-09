package com.student.management_system.repository;

import com.student.management_system.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByCreatedBy_UserId(Long teacherId);

}