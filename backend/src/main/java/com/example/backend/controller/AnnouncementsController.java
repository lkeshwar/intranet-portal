package com.example.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementsController {

    private final List<Map<String, Object>> list = new ArrayList<>();

    @GetMapping
    public List<Map<String, Object>> getAll() {
        return list;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Map<String, Object> body) {
        body.put("id", UUID.randomUUID().toString());
        list.add(body);
        return body;
    }
}
