from django.db import models
from account.models import CustomUser
from emergencies.models import Emergency


class Report(models.Model):
    """Reports on emergencies and activities"""
    REPORT_TYPES = (
        ('incident', 'Incident Report'),
        ('activity', 'Activity Report'),
        ('volunteer', 'Volunteer Report'),
        ('resource', 'Resource Report'),
        ('analytics', 'Analytics Report'),
    )
    
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    title = models.CharField(max_length=255)
    report_type = models.CharField(max_length=50, choices=REPORT_TYPES)
    description = models.TextField()
    
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='reports_created')
    reviewed_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='reports_reviewed')
    
    emergency = models.ForeignKey(Emergency, on_delete=models.CASCADE, blank=True, null=True, related_name='reports')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    attachment = models.FileField(upload_to='report_attachments/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(blank=True, null=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['report_type']),
        ]
    
    def __str__(self):
        return self.title
    
    def submit(self):
        self.status = 'submitted'
        self.submitted_at = models.functions.Now()
        self.save()
    
    def approve(self, reviewer):
        self.status = 'approved'
        self.reviewed_by = reviewer
        self.reviewed_at = models.functions.Now()
        self.save()


class ReportComment(models.Model):
    """Comments on reports"""
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Comment by {self.author.username} on {self.report.title}"
