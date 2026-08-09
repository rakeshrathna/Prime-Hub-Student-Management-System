package com.student.management_system.controller;

import com.student.management_system.entity.Team;
import com.student.management_system.entity.TaskAssignment;
import com.student.management_system.entity.User;
import com.student.management_system.repository.TeamRepository;
import com.student.management_system.service.TaskAssignmentService;
import com.student.management_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class StudentDashboardController {

    @Autowired
    private TaskAssignmentService assignmentService;

    @Autowired
    private UserService userService;

    @Autowired
    private TeamRepository teamRepository;

    // Configurable so it can be pointed at a mounted persistent volume in
    // production (see application.properties). Defaults to "uploads" for local dev.
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @GetMapping("/dashboard/{studentId}")
    public List<TaskAssignment> getMyDashboard(@PathVariable Long studentId) {
        return assignmentService.getStudentAssignments(studentId);
    }

    @GetMapping("/{studentId}/tasks")
    public List<TaskAssignment> getStudentTasks(@PathVariable Long studentId) {
        return assignmentService.getStudentAssignments(studentId);
    }

    @GetMapping("/{studentId}/team")
    public ResponseEntity<?> getStudentTeam(@PathVariable Long studentId) {
        // BUGFIX: this used to be Optional<Team> findByMembers_UserId(...), which
        // threw a 500 (IncorrectResultSizeDataAccessException) the moment a student
        // ended up on more than one team — and the "My team" page in the student
        // portal has no way to distinguish that failure from "not on a team yet",
        // so it just silently showed nothing. Returning a List avoids the crash;
        // we hand back the most recently created team to keep the existing
        // single-team UI working.
        List<Team> teams = teamRepository.findByMembers_UserId(studentId);
        Team team = teams.isEmpty() ? null : teams.get(teams.size() - 1);
        return ResponseEntity.ok(team);
    }

    @PostMapping("/submit/{assignmentId}")
    public TaskAssignment submitTask(
            @PathVariable Long assignmentId,
            @RequestBody(required = false) Map<String, String> body) {
        String content = body != null ? body.get("content") : null;
        return assignmentService.submitWork(assignmentId, content);
    }

    @PutMapping("/profile/{studentId}")
    public User updateProfile(
            @PathVariable Long studentId,
            @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(value = "password", required = false) String password, // MODIFIED: Added password param
            @RequestParam(value = "file", required = false) MultipartFile file) {

        // TRICK: Direct lookup is FAANG-standard. Never use .getAllUsers() to find one
        // ID.
        // We fetch the existing user so we don't lose the 'name' or 'email'.
        User existingUser = userService.getUserById(studentId);

        try {
            // 1. Handle File Upload
            if (file != null && !file.isEmpty()) {
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String fileName = studentId + "_" + UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath);

                // BUGFIX: was hardcoded to "http://localhost:8080/uploads/...", which
                // only ever worked when the frontend and backend were both running on
                // your own machine. In any real deployment (e.g. frontend on Vercel,
                // backend on its own host) the saved URL pointed at the wrong server,
                // so the photo looked like it "didn't save" — it saved, but the URL
                // was unusable. We now store a relative path; the frontend already
                // knows how to turn a relative path into a full URL against whatever
                // backend it's actually configured to use (see resolveAssetUrl in
                // frontend/src/utils/format.js).
                String fileUrl = "/uploads/" + fileName;
                existingUser.setProfileImageUrl(fileUrl);
            }

            // 2. Handle Phone Number
            if (phoneNumber != null && !phoneNumber.isEmpty()) {
                existingUser.setPhoneNumber(phoneNumber);
            }

            // 3. Handle Password (NEW)
            if (password != null && !password.isEmpty()) {
                // We set the plain password here; your UserService.updateUser
                // should handle the BCrypt hashing before saving.
                existingUser.setPassword(password);
            }

            // DO: Pass the whole existingUser object so the name/email/role stay intact
            return userService.updateUser(studentId, existingUser);

        } catch (IOException e) {
            throw new RuntimeException("Could not store file", e);
        }
    }
}