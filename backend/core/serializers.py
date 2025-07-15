from rest_framework import serializers
from .models import Service, SubService, Booking, Employee


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


# ✅ Grouped Subservices Serializer (optional but structured)
class GroupedSubServicesSerializer(serializers.Serializer):
    category = serializers.CharField()
    items = SubServiceSerializer(many=True)


# ✅ Employee Serializer
class EmployeeSerializer(serializers.ModelSerializer):
    services = serializers.StringRelatedField(many=True)  # shows service names

    class Meta:
        model = Employee
        fields = ['id', 'name', 'email', 'services', 'is_available']


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


# ✅ Booking Serializer (with nested employee details)
class BookingSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = '__all__'

    def get_employee_name(self, obj):
        return obj.employee.name if obj.employee else None

