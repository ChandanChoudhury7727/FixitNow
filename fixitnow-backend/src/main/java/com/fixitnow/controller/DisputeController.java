package com.fixitnow.controller;

import com.fixitnow.model.Dispute;
import com.fixitnow.model.Booking;
import com.fixitnow.model.User;
import com.fixitnow.repository.DisputeRepository;
import com.fixitnow.repository.BookingRepository;
import com.fixitnow.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/disputes")
public class DisputeController {

    private final DisputeRepository disputeRepo;
    private final BookingRepository bookingRepo;
    private final UserRepository userRepo;

    public DisputeController(DisputeRepository disputeRepo, BookingRepository bookingRepo, UserRepository userRepo) {
        this.disputeRepo = disputeRepo;
        this.bookingRepo = bookingRepo;
        this.userRepo = userRepo;
    }

    /**
     * Customer creates a dispute/report
     * POST /api/disputes
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createDispute(@RequestBody Map<String, Object> payload, Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            Optional<User> userOpt = userRepo.findByEmail(principal.getName());
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }
            Long customerId = userOpt.get().getId();
            
            Long bookingId = Long.valueOf(payload.get("bookingId").toString());
            
            // Verify booking exists and belongs to customer
            Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);
            if (bookingOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Booking not found"));
            }
            
            Booking booking = bookingOpt.get();
            if (!booking.getCustomerId().equals(customerId)) {
                return ResponseEntity.status(403).body(Map.of("error", "Not your booking"));
            }

            Dispute dispute = new Dispute();
            dispute.setBookingId(bookingId);
            dispute.setCustomerId(customerId);
            dispute.setProviderId(booking.getProviderId());
            dispute.setServiceId(booking.getServiceId());
            dispute.setCategory(payload.getOrDefault("category", "OTHER").toString());
            dispute.setSubject(payload.get("subject").toString());
            dispute.setDescription(payload.get("description").toString());
            
            if (payload.containsKey("refundAmount")) {
                dispute.setRefundAmount(Double.valueOf(payload.get("refundAmount").toString()));
            }

            disputeRepo.save(dispute);

            return ResponseEntity.ok(Map.of(
                "message", "Dispute created successfully",
                "disputeId", dispute.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", "Invalid request: " + e.getMessage()));
        }
    }

    /**
     * Get customer's disputes
     * GET /api/disputes/my
     */
    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMyDisputes(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        Optional<User> userOpt = userRepo.findByEmail(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }
        Long customerId = userOpt.get().getId();
        
        List<Dispute> disputes = disputeRepo.findByCustomerIdOrderByCreatedAtDesc(customerId);
        return ResponseEntity.ok(disputes);
    }

    /**
     * Get disputes for a specific booking
     * GET /api/disputes/booking/{bookingId}
     */
    @GetMapping("/booking/{bookingId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getDisputesByBooking(@PathVariable Long bookingId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        Optional<User> userOpt = userRepo.findByEmail(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }
        Long userId = userOpt.get().getId();
        // Verify user has access to this booking
        Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Booking not found"));
        }
        
        Booking booking = bookingOpt.get();
        if (!booking.getCustomerId().equals(userId) && !booking.getProviderId().equals(userId)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        List<Dispute> disputes = disputeRepo.findByBookingIdOrderByCreatedAtDesc(bookingId);
        return ResponseEntity.ok(disputes);
    }

    /**
     * Admin: Get all disputes
     * GET /api/disputes/admin/all
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllDisputes(@RequestParam(required = false) String status) {
        List<Dispute> disputes;
        if (status != null && !status.isEmpty()) {
            disputes = disputeRepo.findByStatusOrderByCreatedAtDesc(status);
        } else {
            disputes = disputeRepo.findAllByOrderByCreatedAtDesc();
        }
        return ResponseEntity.ok(disputes);
    }

    /**
     * Admin: Update dispute status and resolution
     * PATCH /api/disputes/admin/{id}
     */
    @PatchMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateDispute(@PathVariable Long id, @RequestBody Map<String, Object> payload, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        Optional<User> userOpt = userRepo.findByEmail(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }
        Long adminId = userOpt.get().getId();
        Optional<Dispute> disputeOpt = disputeRepo.findById(id);
        if (disputeOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Dispute not found"));
        }

        Dispute dispute = disputeOpt.get();

        if (payload.containsKey("status")) {
            dispute.setStatus(payload.get("status").toString());
            if ("RESOLVED".equals(dispute.getStatus()) || "REJECTED".equals(dispute.getStatus())) {
                dispute.setResolvedAt(LocalDateTime.now());
            }
        }

        if (payload.containsKey("adminNotes")) {
            dispute.setAdminNotes(payload.get("adminNotes").toString());
        }

        if (payload.containsKey("resolutionNotes")) {
            dispute.setResolutionNotes(payload.get("resolutionNotes").toString());
        }

        if (payload.containsKey("refundStatus")) {
            dispute.setRefundStatus(payload.get("refundStatus").toString());
        }

        if (payload.containsKey("refundAmount")) {
            dispute.setRefundAmount(Double.valueOf(payload.get("refundAmount").toString()));
        }

        if (payload.containsKey("assignedAdminId")) {
            dispute.setAssignedAdminId(Long.valueOf(payload.get("assignedAdminId").toString()));
        } else if (dispute.getAssignedAdminId() == null) {
            dispute.setAssignedAdminId(adminId);
        }

        disputeRepo.save(dispute);

        return ResponseEntity.ok(Map.of(
            "message", "Dispute updated successfully",
            "dispute", dispute
        ));
    }
}
