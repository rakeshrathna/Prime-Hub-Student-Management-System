package com.student.management_system;

import com.student.management_system.entity.*;
import com.student.management_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDate; // ✅ FIXED: was LocalDateTime
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskAssignmentRepository assignmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0)
            return;

        System.out.println("SEEDING DATA START...");

        // 1. Create Users
        User teacher = new User();
        teacher.setName("Jeevanantham");
        teacher.setEmail("jeeva@gmail.com");
        teacher.setPassword(passwordEncoder.encode("password123"));
        teacher.setRole(User.Role.TEACHER);
        userRepository.save(teacher);

        User student1 = new User();
        student1.setName("Raju");
        student1.setEmail("raju@gmail.com");
        student1.setPassword(passwordEncoder.encode("password123"));
        student1.setRole(User.Role.STUDENT);
        userRepository.save(student1);

        User student2 = new User();
        student2.setName("raja");
        student2.setEmail("raja@gmail.com");
        student2.setPassword(passwordEncoder.encode("password123"));
        student2.setRole(User.Role.STUDENT);
        userRepository.save(student2);

        User admin = new User();
        admin.setName("Principal Prince");
        admin.setEmail("admin@school.com");
        admin.setPassword(passwordEncoder.encode("password123"));
        admin.setRole(User.Role.ADMIN);
        userRepository.save(admin);

        // 2. Create a Team
        Team gryffindor = new Team();
        gryffindor.setTeamName("Coders");
        gryffindor.setCreatedBy(teacher);
        gryffindor.setMembers(Arrays.asList(student1, student2));
        teamRepository.save(gryffindor);

        // 3. Create a Task
        Task task = new Task();
        task.setTitle("Build a Flying Car");
        task.setDescription("Use Java Spring Boot to make it fly.");
        task.setPriority(Task.Priority.HIGH);
        task.setTaskType(Task.TaskType.INDIVIDUAL);
        task.setDueDate(LocalDate.now().plusDays(7)); // ✅ FIXED: LocalDate not LocalDateTime
        task.setCreatedBy(teacher);
        taskRepository.save(task);

        // 4. Assign Task to Student
        TaskAssignment assignment = new TaskAssignment();
        assignment.setTask(task);
        assignment.setStudent(student1);
        assignment.setStatus(TaskAssignment.AssignmentStatus.PENDING);
        assignmentRepository.save(assignment);

        System.out.println("DATA SEEDING COMPLETED!");
        System.out.println("Teacher ID: " + teacher.getUserId());
        System.out.println("Student ID: " + student1.getUserId());
    }
}