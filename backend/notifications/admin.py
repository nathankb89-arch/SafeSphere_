from django.contrib import admin
from .models import Notification, NotificationPreference


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'notification_type', 'is_read', 'is_important', 'created_at')
    list_filter = ('notification_type', 'is_read', 'is_important', 'created_at')
    search_fields = ('user__username', 'title', 'message')
    readonly_fields = ('created_at', 'read_at')


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ('user', 'emergency_alerts', 'email_notifications', 'sms_notifications')
    search_fields = ('user__username',)
    readonly_fields = ('created_at', 'updated_at')
