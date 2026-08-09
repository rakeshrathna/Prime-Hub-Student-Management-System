package com.student.management_system.repository;

import com.student.management_system.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    // Force the database to give us the newest announcements first
    List<Announcement> findAllByOrderByPostedAtDesc();

    // Use this as a backup if the one above doesn't work
    @Query("SELECT a FROM Announcement a ORDER BY a.postedAt DESC")
    List<Announcement> findAllAnnouncementsSorted();
}