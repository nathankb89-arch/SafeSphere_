from django.db import models
from accounts.models import CustomUser
from organizations.models import Organization


class Volunteer(models.Model):
    """Volunteer profiles and information"""
    EXPERIENCE_LEVELS = (
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('expert', 'Expert'),
    )
    
    AVAILABILITY_CHOICES = (
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('weekends', 'Weekends Only'),
        ('flexible', 'Flexible'),
    )
    
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='volunteer_profile')
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True, blank=True, related_name='volunteers')
    
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVELS, default='beginner')
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default='flexible')
    
    skills = models.TextField(blank=True, null=True, help_text="Comma separated list of skills")
    certifications = models.TextField(blank=True, null=True)
    
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    
    hours_volunteered = models.IntegerField(default=0)
    emergencies_handled = models.IntegerField(default=0)
    
    bio = models.TextField(blank=True, null=True)
    rating = models.FloatField(default=0.0, help_text="Average rating from 0 to 5")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-hours_volunteered']
    
    def __str__(self):
        return f"{self.user.username} - Volunteer"
    
    def get_skills_list(self):
        if self.skills:
            return [skill.strip() for skill in self.skills.split(',')]
        return []
    
    def is_available_now(self):
        # TODO: implement proper availability checking
        return self.is_active and self.availability != 'part_time'


class VolunteerRating(models.Model):
    """Ratings and reviews for volunteers"""
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='ratings')
    rater = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    review = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('volunteer', 'rater')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.volunteer.user.username} - {self.rating} stars"
