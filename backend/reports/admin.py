from django.contrib import admin
from .models import Report, ReportComment


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'report_type', 'status', 'created_by', 'created_at')
    list_filter = ('report_type', 'status', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at', 'submitted_at', 'reviewed_at')
    
    fieldsets = (
        ('Report Info', {
            'fields': ('title', 'report_type', 'description', 'attachment')
        }),
        ('Related', {
            'fields': ('emergency',)
        }),
        ('Management', {
            'fields': ('created_by', 'status')
        }),
        ('Review', {
            'fields': ('reviewed_by',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'submitted_at', 'reviewed_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ReportComment)
class ReportCommentAdmin(admin.ModelAdmin):
    list_display = ('report', 'author', 'created_at')
    search_fields = ('report__title', 'author__username', 'comment')
    readonly_fields = ('created_at',)
