package com.student.management_system.service;

import com.student.management_system.entity.Team;
import com.student.management_system.entity.User;
import com.student.management_system.repository.TeamRepository;
import com.student.management_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private UserRepository userRepository;

    // Logic: Teacher creates a new team
    public Team createTeam(String teamName, Long teacherId, List<Long> studentIds) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        List<User> students = userRepository.findAllById(studentIds);

        Team team = new Team();
        team.setTeamName(teamName);
        team.setCreatedBy(teacher);
        team.setMembers(students); // JPA handles the relationship automatically

        return teamRepository.save(team);
    }

    // Logic: Get teams created by a teacher
    public List<Team> getTeamsByTeacher(Long teacherId) {
        return teamRepository.findByCreatedBy_UserId(teacherId);
    }
}