package com.example.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final List<Map<String, Object>> records = new ArrayList<>();

    @GetMapping
    public List<Map<String, Object>> all() {
        return records;
    }

    @PostMapping("/mark")
    public Map<String, Object> mark() {

        Map<String, Object> rec = new HashMap<>();

        // Unique ID
        rec.put("id", UUID.randomUUID().toString());

        // Dummy user (replace later with JWT user)
        rec.put("username", "Current User");

        // ✅ Current date in string format
        rec.put("date", new java.text.SimpleDateFormat("yyyy-MM-dd").format(new Date()));

        // ✅ Attendance status
        rec.put("status", "PRESENT");

        records.add(rec);

        return rec;
    }
}
