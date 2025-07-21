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
    PaymentViewSet   # ✅ Import PaymentViewSet
)

router = DefaultRouter()
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'payments', PaymentViewSet, basename='payment')  # ✅ Add this line

urlpatterns = [
    # 🔐 Auth Endpoints
    path('register/', RegisterView.as_view()),
    path('signup/', SignupView.as_view()),
    path('login/', LoginView.as_view()),
    path('forgot-password/', ForgotPasswordView.as_view()),

    # 📦 Service Endpoints
    path('services/', ServiceListView.as_view()),
    path('services/<int:pk>/', ServiceDetailView.as_view()),

    # 📅 Include all ViewSet routes
    path('', include(router.urls)),
]
