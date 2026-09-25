package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.NotificationResponse;
import com.shopsphere.backend.entity.Notification;
import com.shopsphere.backend.entity.NotificationType;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.repository.NotificationRepository;
import com.shopsphere.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository
    ) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    // Create a notification for a user
    public NotificationResponse createNotification(
            Long userId,
            String title,
            String message,
            NotificationType type
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Notification notification = new Notification(
                user,
                title,
                message,
                type
        );

        Notification savedNotification =
                notificationRepository.save(notification);

        return convertToResponse(savedNotification);
    }

    // Get notifications of the logged-in user
    public List<NotificationResponse> getMyNotifications(
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get unread notification count
    public long getUnreadCount(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return notificationRepository
                .countByUserIdAndIsReadFalse(user.getId());
    }

    // Mark one notification as read
    @Transactional
    public void markAsRead(
            Long notificationId,
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        // Security check:
        // User can only modify their own notification.
        if (!notification.getUser().getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not authorized to modify this notification"
            );
        }

        notification.setRead(true);

        notificationRepository.save(notification);
    }

    // Mark all notifications as read
    @Transactional
    public void markAllAsRead(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        List<Notification> notifications =
                notificationRepository
                        .findByUserIdOrderByCreatedAtDesc(
                                user.getId()
                        );

        notifications.forEach(
                notification -> notification.setRead(true)
        );

        notificationRepository.saveAll(notifications);
    }

    // Convert Entity → DTO
    private NotificationResponse convertToResponse(
            Notification notification
    ) {

        return new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}