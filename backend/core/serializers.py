from rest_framework import serializers
from .models import Service, SubService, Booking
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate

User = get_user_model()

# ✅ Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'user')
        )
        return user

# ✅ Login Serializer
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

# ✅ SubService Serializer
class SubServiceSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = SubService
        fields = ['id', 'title', 'price', 'category', 'image', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None

# ✅ Grouped Subservices Serializer
class GroupedSubServicesSerializer(serializers.Serializer):
    category = serializers.CharField()
    items = SubServiceSerializer(many=True)

# ✅ Service Serializer
class ServiceSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    grouped_subservices = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'price', 'image', 'image_url', 'grouped_subservices']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return ""

    def get_grouped_subservices(self, obj):
        grouped = {}
        for sub in obj.subservices.all():
            category = sub.category or "Others"
            grouped.setdefault(category, []).append(sub)

        return [
            {
                "category": cat,
                "items": SubServiceSerializer(subs, many=True, context=self.context).data
            }
            for cat, subs in grouped.items()
        ]

# ✅ Booking Serializer
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
