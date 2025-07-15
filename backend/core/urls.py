from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView,
    LoginView,
    ForgotPasswordView,
    ServiceListView,
    ServiceDetailView,
    BookingViewSet, 
     EmployeeBookingViewSet # ✅ use this
)

router = DefaultRouter()
router.register(r'bookings', BookingViewSet, basename='booking')
router.register("employee/bookings", EmployeeBookingViewSet, basename="employee-bookings")
urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("forgot-password/", ForgotPasswordView.as_view()),
    path("services/", ServiceListView.as_view()),
    path("services/<int:pk>/", ServiceDetailView.as_view()),
    path("", include(router.urls)),  # ✅ all bookings endpoints handled here
]
