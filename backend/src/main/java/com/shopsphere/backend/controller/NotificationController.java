package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.NotificationResponse;
import com.shopsphere.backend.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService
    ) {
        this.notificationService = notificationService;
    }

    // Get all notifications of logged-in user
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                notificationService.getMyNotifications(email)
        );
    }

    // Get unread notification count
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                notificationService.getUnreadCount(email)
        );
    }

    // Mark one notification as read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<String> markAsRead(
            @PathVariable Long notificationId,
            Authentication authentication
    ) {

        String email = authentication.getName();

        notificationService.markAsRead(
                notificationId,
                email
        );

        return ResponseEntity.ok(
                "Notification marked as read"
        );
    }

    // Mark all notifications as read
    @PutMapping("/read-all")
    public ResponseEntity<String> markAllAsRead(
            Authentication authentication
    ) {

        String email = authentication.getName();

        notificationService.markAllAsRead(email);

        return ResponseEntity.ok(
                "All notifications marked as read"
        );
    }

}