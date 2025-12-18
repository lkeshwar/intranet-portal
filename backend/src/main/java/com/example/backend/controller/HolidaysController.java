package com.example.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/holidays")
public class HolidaysController {

    private final List<Map<String, Object>> holidays = new ArrayList<>();

    @GetMapping
    public List<Map<String, Object>> all() {
        return holidays;
    }

    @PostMapping
    public Map<String, Object> add(@RequestBody Map<String, Object> body) {
        body.put("id", UUID.randomUUID().toString());
        holidays.add(body);
        return body;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        holidays.removeIf(h -> h.get("id").equals(id));
    }
}
