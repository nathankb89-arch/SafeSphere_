from django.contrib import admin
from .models import Dashboard, DashboardMetric


@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_emergencies_handled', 'total_volunteers', 'active_organizations')
    search_fields = ('user__username',)
    readonly_fields = ('last_updated',)


@admin.register(DashboardMetric)
class DashboardMetricAdmin(admin.ModelAdmin):
    list_display = ('dashboard', 'metric_type', 'value', 'date')
    list_filter = ('metric_type', 'date')
    search_fields = ('dashboard__user__username',)
    readonly_fields = ('date',)
