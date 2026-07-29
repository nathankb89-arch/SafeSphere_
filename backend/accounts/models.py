from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        CITIZEN = 'citizen', 'Citizen'
        VOLUNTEER = 'volunteer', 'Volunteer'
        NGO = 'ngo', 'NGO Staff'
        ADMIN = 'admin', 'Administrator'

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CITIZEN)
    phone_number = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=255, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} ({self.role})"