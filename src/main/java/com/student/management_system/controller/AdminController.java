package com.student.management_system.controller;

import com.student.management_system.entity.User;
import com.student.management_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserService userService;

    // 1. Get All Users
    // Matches React: usersAPI.list()
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // 2. Add New User
    // FIXED: Removed "/add" to match React usersAPI.create()
    @PostMapping("/users")
    public User addUser(@RequestBody User user) {
        return userService.addUser(user);
    }

    // 3. Update User
    // Matches React: usersAPI.update(id, data)
    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable("id") Long id, @RequestBody User userDetails) {
        return userService.updateUser(id, userDetails);
    }

    // 4. Delete User
    // Matches React: usersAPI.remove(id)
    @DeleteMapping("/users/{id}")
    public java.util.Map<String, String> deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        // Returning a Map/JSON is better for React than a plain String
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "User deleted successfully.");
        return response;
    }
}