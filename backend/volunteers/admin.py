from django.contrib import admin
from .models import Volunteer, VolunteerRating


@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ('user', 'experience_level', 'availability', 'is_active', 'rating', 'hours_volunteered')
    list_filter = ('experience_level', 'availability', 'is_active', 'is_verified')
    search_fields = ('user__username', 'user__email', 'skills')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('User Info', {
            'fields': ('user', 'organization')
        }),
        ('Profile', {
            'fields': ('experience_level', 'availability', 'skills', 'certifications', 'bio')
        }),
        ('Status', {
            'fields': ('is_active', 'is_verified')
        }),
        ('Statistics', {
            'fields': ('hours_volunteered', 'emergencies_handled', 'rating')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(VolunteerRating)
class VolunteerRatingAdmin(admin.ModelAdmin):
    list_display = ('volunteer', 'rating', 'user', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('volunteer__user__username', 'user__username')
    readonly_fields = ('created_at',)
