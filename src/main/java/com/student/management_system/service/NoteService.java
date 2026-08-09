package com.student.management_system.service;

import com.student.management_system.entity.PersonalNote;
import com.student.management_system.entity.User;
import com.student.management_system.repository.PersonalNoteRepository;
import com.student.management_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.student.management_system.dto.NoteRequest;
import java.util.List;

@Service
public class NoteService {

    @Autowired
    private PersonalNoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    public PersonalNote addNote(NoteRequest request) {
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        PersonalNote note = new PersonalNote();
        note.setTeacher(teacher);
        note.setStudent(student);
        note.setContent(request.getContent());

        return noteRepository.save(note);
    }

    public List<PersonalNote> getNotesForStudent(Long teacherId, Long studentId) {
        if (teacherId != null) {
            return noteRepository.findByTeacher_UserIdAndStudent_UserId(teacherId, studentId);
        }
        return noteRepository.findByStudent_UserId(studentId);
    }
}