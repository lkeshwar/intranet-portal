package com.example.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.backend.repository.UserRepository;
import com.example.backend.model.User;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/public/users")
    public List<User> allUsersPublic() {
        return userRepository.findAll();
    }

    @GetMapping("/admin/secret")
    public String adminSecret() {
        return "ONLY ADMIN CAN SEE THIS";
    }
}
