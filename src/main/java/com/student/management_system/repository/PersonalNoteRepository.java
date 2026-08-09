package com.student.management_system.repository;

import com.student.management_system.entity.PersonalNote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PersonalNoteRepository extends JpaRepository<PersonalNote, Long> {
    // Find notes by Teacher AND Student
    List<PersonalNote> findByTeacher_UserIdAndStudent_UserId(Long teacherId, Long studentId);

    List<PersonalNote> findByStudent_UserId(Long studentId);
}