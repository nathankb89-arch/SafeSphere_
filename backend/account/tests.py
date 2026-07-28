from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import CustomUser, UserVerification

User = get_user_model()


class CustomUserTest(TestCase):
    
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_user_creation(self):
        """Test user creation"""
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertTrue(self.user.check_password('testpass123'))
    
    def test_user_is_admin_method(self):
        """Test is_admin method"""
        self.assertFalse(self.user.is_admin())
        
        admin_user = CustomUser.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='admin123',
            role='admin'
        )
        self.assertTrue(admin_user.is_admin())
    
    def test_user_is_coordinator_method(self):
        """Test is_coordinator method"""
        self.assertFalse(self.user.is_coordinator())
        
        coordinator = CustomUser.objects.create_user(
            username='coordinator',
            email='coord@example.com',
            password='coord123',
            role='coordinator'
        )
        self.assertTrue(coordinator.is_coordinator())


class UserVerificationTest(TestCase):
    
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='verifytest',
            email='verify@example.com',
            password='testpass123'
        )
    
    def test_verification_creation(self):
        """Test verification token creation"""
        verification = UserVerification.objects.create(
            user=self.user,
            verification_type='email',
            token='testtoken123',
            expires_at='2025-12-31 23:59:59'
        )
        self.assertEqual(verification.user, self.user)
        self.assertFalse(verification.is_used)
