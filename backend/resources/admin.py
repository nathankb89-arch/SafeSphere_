from django.contrib import admin
from .models import Resource, ResourceAllocation


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('name', 'resource_type', 'organization', 'status', 'quantity_available', 'quantity')
    list_filter = ('resource_type', 'status', 'organization')
    search_fields = ('name', 'description', 'location')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Resource Info', {
            'fields': ('name', 'description', 'resource_type', 'image')
        }),
        ('Organization', {
            'fields': ('organization', 'manager')
        }),
        ('Inventory', {
            'fields': ('quantity', 'quantity_available', 'status')
        }),
        ('Details', {
            'fields': ('location', 'purchase_date', 'last_maintenance', 'cost')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ResourceAllocation)
class ResourceAllocationAdmin(admin.ModelAdmin):
    list_display = ('resource', 'allocated_by', 'quantity_allocated', 'allocated_at', 'returned_at')
    list_filter = ('allocated_at', 'returned_at')
    search_fields = ('resource__name', 'allocated_by__username', 'reason')
    readonly_fields = ('allocated_at',)
