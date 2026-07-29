from django.db import models
from accounts.models import CustomUser
from organizations.models import Organization


class Resource(models.Model):
    """Emergency resources like equipment and supplies"""
    RESOURCE_TYPES = (
        ('equipment', 'Equipment'),
        ('supplies', 'Supplies'),
        ('vehicle', 'Vehicle'),
        ('facility', 'Facility'),
        ('other', 'Other'),
    )
    
    STATUS_CHOICES = (
        ('available', 'Available'),
        ('in_use', 'In Use'),
        ('maintenance', 'Maintenance'),
        ('damaged', 'Damaged'),
    )
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    resource_type = models.CharField(max_length=50, choices=RESOURCE_TYPES)
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='resources')
    manager = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='managed_resources')
    
    quantity = models.IntegerField(default=1, help_text="Total quantity available")
    quantity_available = models.IntegerField(default=1)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    
    purchase_date = models.DateField(blank=True, null=True)
    last_maintenance = models.DateField(blank=True, null=True)
    
    location = models.CharField(max_length=500, blank=True, null=True)
    image = models.ImageField(upload_to='resources/', blank=True, null=True)
    
    cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.organization.name})"
    
    def is_available(self):
        return self.status == 'available' and self.quantity_available > 0


class ResourceAllocation(models.Model):
    """Track resource usage in emergencies"""
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='allocations')
    allocated_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    
    quantity_allocated = models.IntegerField()
    
    reason = models.CharField(max_length=500, blank=True, null=True)
    emergency_id = models.IntegerField(blank=True, null=True)  # TODO: use ForeignKey
    
    allocated_at = models.DateTimeField(auto_now_add=True)
    returned_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-allocated_at']
    
    def __str__(self):
        return f"{self.resource.name} - {self.quantity_allocated} units"
