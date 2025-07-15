# core/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.conf import settings
from django.contrib.auth.models import User
# ✅ Custom user manager
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email=None, password=None, role='user', **extra_fields):
        if not username:
            raise ValueError("Username is required")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email=None, password=None, role='admin', **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(username, email, password, role, **extra_fields)

# ✅ Custom user model
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('employee', 'Employee'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.username} ({self.role})"

# ✅ Service model

class Service(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='service_images/')
    
    def __str__(self):
        return self.name
# ✅ Below your Service model

class SubService(models.Model):
    service = models.ForeignKey(Service, related_name='subservices', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to='subservice_images/', null=True, blank=True)
    category = models.CharField(max_length=100, default='General')  # 👈 Added category

    def __str__(self):
        return self.title

from django.db import models
from django.conf import settings
from .models import Service, SubService  # update this to your actual imports

class Booking(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    subservices = models.ManyToManyField(SubService)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    date = models.DateField()
    time = models.TimeField()
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.user} - {self.service.name}"
