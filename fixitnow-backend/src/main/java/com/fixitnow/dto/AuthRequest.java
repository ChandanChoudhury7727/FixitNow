package com.fixitnow.dto;

public class AuthRequest {
    private String email;
    private String password;
    private String name;
    private String role;
    private String location;

    public AuthRequest() {}

    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getName() { return name; }
    public String getRole() { return role; }
    public String getLocation() { return location; }

    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setName(String name) { this.name = name; }
    public void setRole(String role) { this.role = role; }
    public void setLocation(String location) { this.location = location; }
}
