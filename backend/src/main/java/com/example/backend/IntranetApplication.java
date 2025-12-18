package com.example.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder; // ✅ IMPORTANT IMPORT

import java.util.Set;

@SpringBootApplication
public class IntranetApplication {

    public static void main(String[] args) {
        SpringApplication.run(IntranetApplication.class, args);
    }

    @Bean
    public CommandLineRunner dataLoader(
            UserRepository userRepo,
            RoleRepository roleRepo,
            PasswordEncoder encoder   // ✅ FIXED: Add encoder here
    ) {
        return args -> {

            Role adminRole = roleRepo.findByName("ROLE_ADMIN").orElseGet(() -> {
                Role r = new Role();
                r.setName("ROLE_ADMIN");
                return roleRepo.save(r);
            });

            Role userRole = roleRepo.findByName("ROLE_USER").orElseGet(() -> {
                Role r = new Role();
                r.setName("ROLE_USER");
                return roleRepo.save(r);
            });

            if (userRepo.findByEmail("admin@portal.com").isEmpty()) {

                User admin = new User();
                admin.setUsername("admin");
                admin.setName("Admin User");
                admin.setEmail("admin@portal.com");
                admin.setDepartment("IT");

                // ✅ FINAL FIX — USING BCRYPT
                admin.setPassword(encoder.encode("12345678"));

                admin.setRoles(Set.of(adminRole, userRole));

                userRepo.save(admin);

                System.out.println("Created default admin: admin@portal.com / 12345678");
            } else {
                System.out.println("Admin already exists");
            }
        };
    }
}
