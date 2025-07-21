from django.contrib.auth import authenticate, get_user_model
from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Service, Booking
from .serializers import PaymentSerializer
from .models import Payment
from .serializers import (
    RegisterSerializer, LoginSerializer,
    ServiceSerializer, BookingSerializer
)

User = get_user_model()

# 🔹 Register & Signup
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class SignupView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Signup successful"}, status=201)
        return Response(serializer.errors, status=400)

# 🔹 Login
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.data['username']
            password = serializer.data['password']
            user = authenticate(username=username, password=password)

            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "username": user.username,
                    "role": user.role,
                    "id": user.id,
                }, status=status.HTTP_200_OK)
            return Response({"error": "Invalid credentials"}, status=401)
        return Response(serializer.errors, status=400)

# 🔹 Forgot Password
class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get("email")
        new_password = request.data.get("new_password")

        if not email or not new_password:
            return Response({"error": "Email and new password are required."}, status=400)

        user = User.objects.filter(email=email).first()
        if user:
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password updated successfully."}, status=200)
        return Response({"error": "User with this email does not exist."}, status=404)

# 🔹 Services
class ServiceListView(generics.ListCreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

    def get_serializer_context(self):
        return {'request': self.request}

class ServiceDetailView(APIView):
    def get(self, request, pk):
        try:
            service = Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            return Response({"error": "Service not found"}, status=404)

        serializer = ServiceSerializer(service, context={'request': request})
        grouped = {}

        for sub in service.subservices.all():
            category = sub.category or 'Others'
            grouped.setdefault(category, []).append({
                'id': sub.id,
                'title': sub.title,
                'price': str(sub.price),
                'image_url': sub.image.url if sub.image else "",
            })

        return Response({
            **serializer.data,
            "grouped_subservices": [{"category": cat, "items": items} for cat, items in grouped.items()]
        })

# 🔹 Bookings
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [AllowAny] 
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer