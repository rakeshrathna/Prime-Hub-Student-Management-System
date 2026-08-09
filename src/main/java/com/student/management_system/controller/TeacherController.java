package com.student.management_system.controller;

import com.student.management_system.entity.Team;
import com.student.management_system.entity.User;
import com.student.management_system.repository.UserRepository;
import com.student.management_system.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher")
// ✅ REMOVED @CrossOrigin — handled globally by SecurityConfig
public class TeacherController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeamService teamService;

    // 1. Get all students
    @GetMapping("/students")
    public List<User> getAllStudents() {
        return userRepository.findByRole(User.Role.STUDENT);
    }

    // 2. Get all teams created by this teacher
    @GetMapping("/{teacherId}/teams")
    public List<Team> getTeacherTeams(@PathVariable Long teacherId) {
        return teamService.getTeamsByTeacher(teacherId);
    }

    // 3. Create a new Team
    @PostMapping("/{teacherId}/teams/create")
    public Team createTeam(@PathVariable Long teacherId, @RequestBody TeamCreationRequest request) {
        if (request.getStudentIds() == null || request.getStudentIds().isEmpty()) {
            throw new IllegalArgumentException("A team must have at least one student.");
        }
        return teamService.createTeam(request.getResolvedName(), teacherId, request.getStudentIds());
    }

    public static class TeamCreationRequest {
        private String name; // ✅ ADDED: frontend sends "name"
        private String teamName; // kept for backward compat
        private List<Long> studentIds;

        // ✅ FIXED: resolves whichever field frontend sends
        public String getResolvedName() {
            if (name != null && !name.trim().isEmpty())
                return name.trim();
            if (teamName != null && !teamName.trim().isEmpty())
                return teamName.trim();
            return "Unnamed Team";
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getTeamName() {
            return teamName;
        }

        public void setTeamName(String teamName) {
            this.teamName = teamName;
        }

        public List<Long> getStudentIds() {
            return studentIds;
        }

        public void setStudentIds(List<Long> studentIds) {
            this.studentIds = studentIds;
        }
    }
}