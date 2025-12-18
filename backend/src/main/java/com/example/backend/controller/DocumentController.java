package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:5173")
public class DocumentController {

    private static final String UPLOAD_DIR = "uploads/";

    // Upload multiple files
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFiles(@RequestParam("files") MultipartFile[] files) throws IOException {
        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) dir.mkdirs();

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                File dest = new File(UPLOAD_DIR + file.getOriginalFilename());
                file.transferTo(dest);
            }
        }

        return ResponseEntity.ok("Files uploaded successfully!");
    }

    // List all files
    @GetMapping
    public ResponseEntity<?> listFiles() {
        File folder = new File(UPLOAD_DIR);
        if (!folder.exists()) folder.mkdirs();

        File[] files = folder.listFiles();
        if (files == null) return ResponseEntity.ok(List.of());

        List<String> filenames = Arrays.stream(files)
                .map(File::getName)
                .collect(Collectors.toList());

        return ResponseEntity.ok(filenames);
    }

    // Download a file by name
    @GetMapping("/{filename}/download")
    public ResponseEntity<?> downloadFile(@PathVariable String filename) throws IOException {
        File file = new File(UPLOAD_DIR + filename);
        if (!file.exists()) return ResponseEntity.notFound().build();

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + file.getName() + "\"")
                .body(file);
    }
}
