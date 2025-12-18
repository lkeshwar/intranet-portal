package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // List all employees (requires auth)
    @GetMapping
    public List<User> all() {
        // beware: do not expose passwords in real apps — consider DTOs or @JsonIgnore
        return userRepository.findAll();
    }

    // Get single employee by id
    @GetMapping("/{id}")
    public ResponseEntity<User> getOne(@PathVariable Long id) {
        Optional<User> u = userRepository.findById(id);
        return u.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create employee — ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<User> create(@RequestBody User payload) {
        // encode password if provided
        if (payload.getPassword() != null && !payload.getPassword().isBlank()) {
            payload.setPassword(passwordEncoder.encode(payload.getPassword()));
        }
        User saved = userRepository.save(payload);
        // hide password before returning (optional)
        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }

    // Update employee — ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User payload) {
        return userRepository.findById(id).map(u -> {
            u.setUsername(payload.getUsername());
            u.setName(payload.getName());
            u.setEmail(payload.getEmail());
            u.setDepartment(payload.getDepartment());
            if (payload.getPassword() != null && !payload.getPassword().isBlank()) {
                u.setPassword(passwordEncoder.encode(payload.getPassword()));
            }
            userRepository.save(u);
            u.setPassword(null);
            return ResponseEntity.ok(u);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete employee — ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
