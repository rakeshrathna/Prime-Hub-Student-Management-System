package com.student.management_system.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {

    // Door 1: ADMIN ONLY
    @GetMapping("/admin/test")
    public String adminAccess() {
        return "You are an ADMIN. Welcome!";
    }

    // Door 2: TEACHER ONLY
    @GetMapping("/teacher/test")
    public String teacherAccess() {
        return "You are a TEACHER. Welcome!";
    }

    // Door 3: STUDENT ONLY
    @GetMapping("/student/test")
    public String studentAccess() {
        return "You are a STUDENT. Welcome!";
    }
}