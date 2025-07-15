from django.contrib.auth import authenticate, get_user_model
from rest_framework import generics, serializers, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from .models import Service, Booking
from .serializers import ServiceSerializer, BookingSerializer

User = get_user_model()

# 🔹 Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=[('user', 'User'), ('employee', 'Employee'), ('admin', 'Admin')], default='user')

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({"username": "Username already exists"})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email already registered"})
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data['role']
        )

        # ✅ Send welcome email
        send_mail(
            subject="Welcome to Urban Services!",
            message=f"Hello {user.username},\n\nThanks for registering with Urban Services. We're glad to have you!",
            from_email="yourgmail@gmail.com",  # Replace with your actual email
            recipient_list=[user.email],
            fail_silently=False,
        )

        return user

# 🔹 Register View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as ve:
            return Response(ve.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("❌ Server Error:", str(e))
            return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# 🔹 Login View
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Both username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user:
            return Response({
                "message": "Login successful",
                "username": user.username,
                "role": user.role,
                "user_id": user.id
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# 🔹 Forgot Password View
class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get("email")
        new_password = request.data.get("new_password")

        if not email or not new_password:
            return Response({"error": "Email and new password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()
        if user:
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

# 🔹 Service List + Create View
class ServiceListView(generics.ListCreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

    def get_serializer_context(self):
        return {'request': self.request}

# 🔹 Service Detail View (GET with grouped subservices)
class ServiceDetailView(APIView):
    def get(self, request, pk):
        try:
            service = Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            return Response({"error": "Service not found"}, status=status.HTTP_404_NOT_FOUND)

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

        grouped_subservices = [
            {"category": cat, "items": items}
            for cat, items in grouped.items()
        ]

        return Response({
            **serializer.data,
            "grouped_subservices": grouped_subservices
        })

# 🔹 Booking Create API
class BookingCreateAPIView(APIView):
    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
