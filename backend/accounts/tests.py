from django.test import TestCase, override_settings
from rest_framework.test import APIClient


@override_settings(ALLOWED_HOSTS=['testserver'])
class AuthenticationFlowTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.registration = {
			'username': 'flow_user',
			'email': 'flow@example.com',
			'password': 'SafeSphereTest123!',
			'password_confirm': 'SafeSphereTest123!',
			'role': 'citizen',
			'phone_number': '',
			'location': '',
		}

	def test_registration_and_login_flow(self):
		registration_response = self.client.post('/api/auth/register/', self.registration, format='json')
		self.assertEqual(registration_response.status_code, 201)

		login_response = self.client.post('/api/auth/login/', {
			'username': self.registration['username'],
			'password': self.registration['password'],
		}, format='json')
		self.assertEqual(login_response.status_code, 200)
		self.assertIn('access', login_response.data)
		self.assertIn('refresh', login_response.data)
