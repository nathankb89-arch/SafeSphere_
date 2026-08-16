from django.db import models


class SafetyResource(models.Model):
    """A public emergency hotline or support contact."""

    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=30)
    region = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
