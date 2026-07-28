from django.contrib import admin
from .models import Emergency, EmergencyResponse


@admin.register(Emergency)
class EmergencyAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'priority', 'reported_by', 'reported_at')
    list_filter = ('status', 'priority', 'category', 'reported_at')
    search_fields = ('title', 'description', 'location')
    readonly_fields = ('reported_at', 'updated_at', 'resolved_at')
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'description', 'category', 'image')
        }),
        ('Status', {
            'fields': ('status', 'priority')
        }),
        ('Assignment', {
            'fields': ('reported_by', 'assigned_to', 'organization')
        }),
        ('Location', {
            'fields': ('location', 'latitude', 'longitude')
        }),
        ('Timeline', {
            'fields': ('reported_at', 'updated_at', 'resolved_at')
        }),
    )


@admin.register(EmergencyResponse)
class EmergencyResponseAdmin(admin.ModelAdmin):
    list_display = ('emergency', 'volunteer', 'status', 'response_time')
    list_filter = ('status', 'response_time')
    search_fields = ('emergency__title', 'volunteer__username')
    readonly_fields = ('response_time',)
