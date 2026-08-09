package com.student.management_system.service;

import com.student.management_system.entity.Announcement;
import com.student.management_system.entity.User;
import com.student.management_system.repository.AnnouncementRepository;
import com.student.management_system.repository.UserRepository;
import com.student.management_system.dto.AnnouncementRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Announcement postAnnouncement(AnnouncementRequest request) {
        try {
            // Validation: Ensure ID is actually coming from Frontend
            if (request.getTeacherId() == null) {
                throw new IllegalArgumentException("Teacher ID is missing in the request payload.");
            }

            System.out.println(
                    "Processing announcement: " + request.getTitle() + " for Teacher ID: " + request.getTeacherId());

            User teacher = userRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new RuntimeException(
                            "Teacher not found in Database with ID: " + request.getTeacherId()));

            Announcement announcement = new Announcement();
            announcement.setTitle(request.getTitle());
            announcement.setContent(request.getContent());
            announcement.setPostedBy(teacher);
            announcement.setPostedAt(LocalDateTime.now());

            return announcementRepository.saveAndFlush(announcement);
        } catch (Exception e) {
            System.err.println("CRITICAL SERVICE ERROR: " + e.getMessage());
            throw e;
        }
    }

    public List<Announcement> getAllAnnouncements() {
        try {
            // Ensure this matches your Repository method exactly
            return announcementRepository.findAllByOrderByPostedAtDesc();
        } catch (Exception e) {
            System.err.println("FETCH ERROR: Check if 'postedAt' exists in Entity. Error: " + e.getMessage());
            return announcementRepository.findAll(); // Fallback to unsorted if sorting fails
        }
    }
}