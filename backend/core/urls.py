from django.urls import path
from .views import (
    RegisterView, LoginView, ForgotPasswordView,
    ServiceListView, ServiceDetailView, BookingCreateAPIView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),

    path('services/', ServiceListView.as_view(), name='service-list'),
    path('services/<int:pk>/', ServiceDetailView.as_view(), name='service-detail'),

    path('bookings/', BookingCreateAPIView.as_view(), name='create-booking'),  # ✅ THIS FIXES YOUR 404
]
