from django.db import models
from django.conf import settings


class Emergency(models.Model):
    class EmergencyType(models.TextChoices):
        FIRE = 'fire', 'Fire'
        FLOOD = 'flood', 'Flood'
        ACCIDENT = 'accident', 'Road Accident'
        MEDICAL = 'medical', 'Medical Emergency'
        LANDSLIDE = 'landslide', 'Landslide'
        EARTHQUAKE = 'earthquake', 'Earthquake'
        OUTBREAK = 'outbreak', 'Disease Outbreak'
        OTHER = 'other', 'Other'

    class Severity(models.TextChoices):
        LOW = 'low', 'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH = 'high', 'High'
        CRITICAL = 'critical', 'Critical'

    class Status(models.TextChoices):
        REPORTED = 'reported', 'Reported'
        ASSIGNED = 'assigned', 'Assigned'
        IN_PROGRESS = 'in_progress', 'In Progress'
        RESOLVED = 'resolved', 'Resolved'

    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reported_emergencies'
    )
    emergency_type = models.CharField(max_length=20, choices=EmergencyType.choices)
    severity = models.CharField(max_length=10, choices=Severity.choices, default=Severity.MEDIUM)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.REPORTED)
    description = models.TextField()
    location = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    evidence_image = models.ImageField(upload_to='emergencies/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_emergency_type_display()} at {self.location} ({self.status})"