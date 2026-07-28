import secrets
import string
from datetime import timedelta
from django.utils import timezone
from account.models import UserVerification


def generate_verification_token(length=32):
    """Generate a random verification token"""
    characters = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(characters) for _ in range(length))
    return token


def create_verification_link(user, verification_type='email'):
    """Create a verification link for a user"""
    token = generate_verification_token()
    
    expires_at = timezone.now() + timedelta(hours=24)
    
    verification = UserVerification.objects.create(
        user=user,
        verification_type=verification_type,
        token=token,
        expires_at=expires_at
    )
    
    # TODO: implement actual email sending
    verification_link = f"http://localhost:3000/verify?token={token}"
    return verification_link, verification


def verify_token(token):
    """Verify a token and return the user if valid"""
    try:
        verification = UserVerification.objects.get(token=token)
        
        if verification.is_expired():
            return None, "Token has expired"
        
        if verification.is_used:
            return None, "Token has already been used"
        
        return verification.user, None
    except UserVerification.DoesNotExist:
        return None, "Invalid token"


def get_client_ip(request):
    """Get client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
