package com.example.backend.model;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique=true)
    private String username;

    private String name;

    @Column(unique=true)
    private String email;

    private String password;

    private String department;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
      name = "users_roles",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "roles_id")
    )
    private Set<Role> roles;

    // getters & setters
    public Long getId(){ return id; }
    public void setId(Long id){ this.id = id; }
    public String getUsername(){ return username; }
    public void setUsername(String username){ this.username = username; }
    public String getName(){ return name; }
    public void setName(String name){ this.name = name; }
    public String getEmail(){ return email; }
    public void setEmail(String email){ this.email = email; }
    public String getPassword(){ return password; }
    public void setPassword(String password){ this.password = password; }
    public String getDepartment(){ return department; }
    public void setDepartment(String department){ this.department = department; }
    public Set<Role> getRoles(){ return roles; }
    public void setRoles(Set<Role> roles){ this.roles = roles; }
}
