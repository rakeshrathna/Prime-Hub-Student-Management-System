package com.student.management_system.controller;

import com.student.management_system.entity.Announcement;
import com.student.management_system.entity.LeaveApplication;
import com.student.management_system.entity.PersonalNote;
import com.student.management_system.service.*;
import com.student.management_system.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/school")
public class SchoolController {

    @Autowired
    private AnnouncementService announcementService;

    @Autowired
    private LeaveService leaveService;

    @Autowired
    private NoteService noteService;

    // --- ANNOUNCEMENTS ---
    @PostMapping("/announcements")
    public Announcement postAnnouncement(@RequestBody AnnouncementRequest request) {
        return announcementService.postAnnouncement(request);
    }

    @GetMapping("/announcements")
    public List<Announcement> getAllAnnouncements() {
        return announcementService.getAllAnnouncements();
    }

    // --- LEAVES ---
    @PostMapping("/leave/apply")
    public LeaveApplication applyForLeave(@RequestBody LeaveRequest request) {
        return leaveService.applyForLeave(request);
    }

    // TEACHER VIEW: Get all pending applications
    @GetMapping("/leave/pending")
    public List<LeaveApplication> getPendingLeaves() {
        return leaveService.getPendingLeaves();
    }

    // STUDENT VIEW: Get history for a specific student (FIXED: Added this endpoint)
    @GetMapping("/leave/history/{studentId}")
    public List<LeaveApplication> getStudentLeaveHistory(@PathVariable Long studentId) {
        return leaveService.getStudentLeaves(studentId);
    }

    @PatchMapping("/leave/status/{leaveId}")
    public LeaveApplication updateLeaveStatus(@PathVariable Long leaveId, @RequestBody Map<String, String> body) {
        // TRAP: Ensure the frontend sends { "status": "APPROVED" }
        String statusStr = body.get("status");
        if (statusStr == null) {
            throw new IllegalArgumentException("Status field is missing in request body");
        }
        LeaveApplication.LeaveStatus status = LeaveApplication.LeaveStatus.valueOf(statusStr.toUpperCase());
        return leaveService.updateLeaveStatus(leaveId, status);
    }

    // --- NOTES ---
    @PostMapping("/notes")
    public PersonalNote addNote(@RequestBody NoteRequest request) {
        return noteService.addNote(request);
    }

    @GetMapping("/notes")
    public List<PersonalNote> getNotes(
            @RequestParam(required = false) Long teacherId,
            @RequestParam(required = true) Long studentId) {
        return noteService.getNotesForStudent(teacherId, studentId);
    }
}