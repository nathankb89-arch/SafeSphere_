from django.db import models
from django.conf import settings
from emergencies.models import Emergency


class VolunteerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                 related_name='volunteer_profile')
    skills = models.CharField(max_length=255, blank=True, help_text="e.g. first aid, swimming, driving")
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"Volunteer: {self.user.username}"


class Assignment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ACCEPTED = 'accepted', 'Accepted'
        DECLINED = 'declined', 'Declined'
        COMPLETED = 'completed', 'Completed'

    emergency = models.ForeignKey(Emergency, on_delete=models.CASCADE, related_name='assignments')
    volunteer = models.ForeignKey(VolunteerProfile, on_delete=models.CASCADE, related_name='assignments')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['emergency', 'volunteer']

    def __str__(self):
        return f"{self.volunteer.user.username} -> {self.emergency} ({self.status})"