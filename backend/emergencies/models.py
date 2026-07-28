from django.conf import settings
from django.db import models
from organizations.models import Organization
from django.utils import timezone


class Emergency(models.Model):
    """Emergency incidents reported in the system"""
    STATUS_CHOICES = (
        ('reported', 'Reported'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('cancelled', 'Cancelled'),
    )
    
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    )
    
    CATEGORY_CHOICES = (
        ('fire', 'Fire'),
        ('flood', 'Flood'),
        ('medical', 'Medical'),
        ('accident', 'Accident'),
        ('security', 'Security'),
        ('other', 'Other'),
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='reported')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    
    reported_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='emergencies_reported')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='emergencies_assigned')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='emergencies', null=True, blank=True)
    
    location = models.CharField(max_length=500)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    
    reported_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(blank=True, null=True)
    
    image = models.ImageField(upload_to='emergencies/', blank=True, null=True)
    
    class Meta:
        ordering = ['-reported_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['priority']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"
    
    def is_urgent(self):
        return self.priority in ['high', 'critical']
    
    def mark_resolved(self):
        self.status = 'resolved'
        self.resolved_at = timezone.now()
        self.save()


class EmergencyResponse(models.Model):
    """Track responses to emergencies"""
    emergency = models.ForeignKey(Emergency, on_delete=models.CASCADE, related_name='responses')
    volunteer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='emergency_responses')
    status = models.CharField(max_length=20, choices=(('accepted', 'Accepted'), ('rejected', 'Rejected'), ('pending', 'Pending')), default='pending')
    response_time = models.DateTimeField(auto_now_add=True)
    arrival_time = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-response_time']
        unique_together = ('emergency', 'volunteer')
    
    def __str__(self):
        return f"{self.volunteer.username} - {self.emergency.title}"
