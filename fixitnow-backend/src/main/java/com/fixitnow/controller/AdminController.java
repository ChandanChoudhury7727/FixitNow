// package com.fixitnow.controller;

// import org.springframework.security.access.prepost.PreAuthorize;
// import com.fixitnow.model.ServiceEntity;
// import com.fixitnow.repository.ServiceRepository;
// import com.fixitnow.service.GeocodingService;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import java.util.ArrayList;
// import java.util.List;

// @RestController
// @RequestMapping("/api/admin")
// public class AdminController {

//     private final ServiceRepository serviceRepo;
//     private final GeocodingService geocodingService;

//     public AdminController(ServiceRepository serviceRepo, GeocodingService geocodingService) {
//         this.serviceRepo = serviceRepo;
//         this.geocodingService = geocodingService;
//     }

//     /**
//      * One-time endpoint to geocode services missing coordinates. Call manually.
//      * Requires `security.maps.apiKey` set in application.properties or environment.
//      */
//     @PostMapping("/geocode-services")
//     @PreAuthorize("hasRole('ADMIN')")
//     public ResponseEntity<?> geocodeMissingServices() {
//         List<ServiceEntity> missing = serviceRepo.findByLatitudeIsNullOrLongitudeIsNull();
//         List<Long> updated = new ArrayList<>();
//         for (ServiceEntity s : missing) {
//             String addr = s.getLocation();
//             if (addr == null || addr.isBlank()) continue;
//             geocodingService.geocode(addr).ifPresent(latlng -> {
//                 s.setLatitude(latlng[0]);
//                 s.setLongitude(latlng[1]);
//                 serviceRepo.save(s);
//                 updated.add(s.getId());
//             });
//         }
//         return ResponseEntity.ok("Updated coordinates for " + updated.size() + " services: " + updated);
//     }
// }


package com.fixitnow.controller;

import com.fixitnow.model.ServiceEntity;
import com.fixitnow.model.User;
import com.fixitnow.model.Booking;
import com.fixitnow.repository.ServiceRepository;
import com.fixitnow.repository.UserRepository;
import com.fixitnow.repository.BookingRepository;
import com.fixitnow.service.GeocodingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ServiceRepository serviceRepo;
    private final UserRepository userRepo;
    private final BookingRepository bookingRepo;
    private final GeocodingService geocodingService;

    public AdminController(ServiceRepository serviceRepo, 
                          UserRepository userRepo, 
                          BookingRepository bookingRepo,
                          GeocodingService geocodingService) {
        this.serviceRepo = serviceRepo;
        this.userRepo = userRepo;
        this.bookingRepo = bookingRepo;
        this.geocodingService = geocodingService;
    }

    /**
     * Get all users
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepo.findAll();
        return ResponseEntity.ok(users);
    }

    /**
     * Get all services
     */
    @GetMapping("/services")
    public ResponseEntity<?> getAllServices() {
        List<ServiceEntity> services = serviceRepo.findAll();
        return ResponseEntity.ok(services);
    }

    /**
     * Get all bookings
     */
    @GetMapping("/bookings")
    public ResponseEntity<?> getAllBookings() {
        List<Booking> bookings = bookingRepo.findAll();
        return ResponseEntity.ok(bookings);
    }

    /**
     * Delete a user
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepo.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }
        userRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    /**
     * Delete a service
     */
    @DeleteMapping("/services/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        if (!serviceRepo.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of("error", "Service not found"));
        }
        serviceRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Service deleted"));
    }

    /**
     * Verify provider (placeholder - implement as needed)
     */
    @PostMapping("/providers/{id}/verify")
    public ResponseEntity<?> verifyProvider(@PathVariable Long id) {
        // Implement provider verification logic
        // For now, just return success
        return ResponseEntity.ok(Map.of("message", "Provider verified"));
    }

    /**
     * One-time endpoint to geocode services missing coordinates
     */
    @PostMapping("/geocode-services")
    public ResponseEntity<?> geocodeMissingServices() {
        List<ServiceEntity> missing = serviceRepo.findByLatitudeIsNullOrLongitudeIsNull();
        List<Long> updated = new ArrayList<>();
        for (ServiceEntity s : missing) {
            String addr = s.getLocation();
            if (addr == null || addr.isBlank()) continue;
            geocodingService.geocode(addr).ifPresent(latlng -> {
                s.setLatitude(latlng[0]);
                s.setLongitude(latlng[1]);
                serviceRepo.save(s);
                updated.add(s.getId());
            });
        }
        return ResponseEntity.ok(Map.of(
            "message", "Updated coordinates for " + updated.size() + " services",
            "serviceIds", updated
        ));
    }
}