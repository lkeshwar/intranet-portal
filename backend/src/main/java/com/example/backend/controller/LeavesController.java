package com.example.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/leaves")
public class LeavesController {

    private final List<Map<String, Object>> leaves = new ArrayList<>();

    // ✅ Everyone can view all leaves
    @GetMapping
    public List<Map<String, Object>> all() {
        return leaves;
    }

    // ✅ Anyone can apply
    @PostMapping
    public Map<String, Object> apply(@RequestBody Map<String, Object> body) {
        body.put("id", UUID.randomUUID().toString());
        body.put("status", "PENDING");
        body.put("appliedAt", new Date());
        leaves.add(body);
        return body;
    }

    // ✅ Only admin can approve
    @PutMapping("/{id}/approve")
    public Map<String, Object> approve(@PathVariable String id,
                                       HttpServletRequest request) {

        String email = request.getHeader("x-user-email");

        if (!"admin@portal.com".equals(email)) {
            throw new RuntimeException("Only admin can approve leaves");
        }

        for (Map<String, Object> leave : leaves) {
            if (leave.get("id").equals(id)) {
                leave.put("status", "APPROVED");
                return leave;
            }
        }
        return null;
    }

    // ✅ Only admin can reject
    @PutMapping("/{id}/reject")
    public Map<String, Object> reject(@PathVariable String id,
                                      HttpServletRequest request) {

        String email = request.getHeader("x-user-email");

        if (!"admin@portal.com".equals(email)) {
            throw new RuntimeException("Only admin can reject leaves");
        }

        for (Map<String, Object> leave : leaves) {
            if (leave.get("id").equals(id)) {
                leave.put("status", "REJECTED");
                return leave;
            }
        }
        return null;
    }
}
