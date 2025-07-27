from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView,
    SignupView,
    LoginView,
    ForgotPasswordView,
    ServiceListView,
    ServiceDetailView,
    BookingViewSet,
    PaymentViewSet,AdminBookingsAPIView,AdminStatsAPIView   # ✅ Import PaymentViewSet
)
from .views import MLPredictionAPIView
from .views import AdminLoginView
router = DefaultRouter()
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'payments', PaymentViewSet, basename='payment')  # ✅ Add this line

urlpatterns = [
    # 🔐 Auth Endpoints
    path('register/', RegisterView.as_view()),
    path('signup/', SignupView.as_view()),
    path('login/', LoginView.as_view()),
    path('forgot-password/', ForgotPasswordView.as_view()),
    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),
    # 📦 Service Endpoints
    path('services/', ServiceListView.as_view()),
    path('services/<int:pk>/', ServiceDetailView.as_view()),
    path('ml/predict/', MLPredictionAPIView.as_view()),
    path('admin/stats/', AdminStatsAPIView.as_view(), name='admin-stats'),
    path('admin/bookings/', AdminBookingsAPIView.as_view(), name='admin-bookings'),
    # 📅 Include all ViewSet routes
    path('', include(router.urls)),
]
