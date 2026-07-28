from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from dashboard.models import Dashboard

User = get_user_model()


class Command(BaseCommand):
    help = 'Create sample superuser and initialize project'
    
    def handle(self, *args, **options):
        # Create superuser if not exists
        if not User.objects.filter(username='admin').exists():
            admin_user = User.objects.create_superuser(
                username='admin',
                email='admin@safesphere.local',
                password='Admin123!@',
                first_name='Admin',
                last_name='User',
                role='admin'
            )
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created superuser: {admin_user.username}')
            )
            
            # Create dashboard for admin
            Dashboard.objects.get_or_create(user=admin_user)
        else:
            self.stdout.write(self.style.WARNING('Admin user already exists'))
        
        # Create a test coordinator
        if not User.objects.filter(username='coordinator1').exists():
            coordinator = User.objects.create_user(
                username='coordinator1',
                email='coordinator@safesphere.local',
                password='Coordinator123!@',
                first_name='John',
                last_name='Coordinator',
                role='coordinator',
                is_staff=True
            )
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created coordinator: {coordinator.username}')
            )
        
        self.stdout.write(self.style.SUCCESS('Project initialization complete'))
