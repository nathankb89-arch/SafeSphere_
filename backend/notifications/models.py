from django.conf import settings
from django.db import models


class Notification(models.Model):
    """System notifications for users"""
    NOTIFICATION_TYPES = (
        ('emergency_alert', 'Emergency Alert'),
        ('task_assigned', 'Task Assigned'),
        ('update', 'Update'),
        ('reminder', 'Reminder'),
        ('system', 'System Message'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    
    is_read = models.BooleanField(default=False)
    is_important = models.BooleanField(default=False)
    
    related_object_id = models.IntegerField(blank=True, null=True)
    related_object_type = models.CharField(max_length=50, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"
    
    def mark_as_read(self):
        if not self.is_read:
            self.is_read = True
            self.read_at = models.F('created_at')  # TODO: fix this
            self.save()


class NotificationPreference(models.Model):
    """User notification preferences"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notification_preferences')
    
    emergency_alerts = models.BooleanField(default=True)
    task_notifications = models.BooleanField(default=True)
    system_notifications = models.BooleanField(default=True)
    email_notifications = models.BooleanField(default=False)
    sms_notifications = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Notification Preferences'
    
    def __str__(self):
        return f"{self.user.username} - Notification Preferences"
