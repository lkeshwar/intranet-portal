package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.AuthResponse;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public Object login(@RequestBody AuthRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElse(userRepository.findByEmail(request.getUsername()).orElse(null));

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return "Invalid Credentials";
        }

        var roles = user.getRoles().stream()
                .map(r -> "ROLE_" + r.getName())
                .collect(Collectors.toSet());

        // FIX: Token should use USERNAME, NOT EMAIL
        String token = jwtUtil.generateToken(user.getUsername(), roles);

        return new AuthResponse(token);
    }
}
