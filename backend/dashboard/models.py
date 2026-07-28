from django.db import models
from account.models import CustomUser
from django.db.models import Sum, Count
from django.utils import timezone


class Dashboard(models.Model):
    """Dashboard statistics and summary"""
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='dashboard')
    total_emergencies_handled = models.IntegerField(default=0)
    total_volunteers = models.IntegerField(default=0)
    active_organizations = models.IntegerField(default=0)
    total_resources = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Dashboards'
    
    def __str__(self):
        return f"Dashboard for {self.user.username}"
    
    def get_recent_emergencies(self):
        # TODO: need to import from emergencies app
        return None
    
    def get_active_volunteers(self):
        from volunteers.models import Volunteer
        return Volunteer.objects.filter(is_active=True).count()


class DashboardMetric(models.Model):
    """Track various metrics over time"""
    METRIC_TYPES = (
        ('emergency_count', 'Emergency Count'),
        ('volunteer_count', 'Volunteer Count'),
        ('resource_usage', 'Resource Usage'),
        ('organization_count', 'Organization Count'),
    )
    
    dashboard = models.ForeignKey(Dashboard, on_delete=models.CASCADE, related_name='metrics')
    metric_type = models.CharField(max_length=50, choices=METRIC_TYPES)
    value = models.IntegerField()
    date = models.DateField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
        unique_together = ('dashboard', 'metric_type', 'date')
    
    def __str__(self):
        return f"{self.dashboard.user.username} - {self.get_metric_type_display()}"
