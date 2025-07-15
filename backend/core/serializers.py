from rest_framework import serializers
from .models import Service, SubService, Booking

# ✅ SubService serializer
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

# ✅ Grouped subservices serializer (optional: used for custom grouping if needed)
class GroupedSubServicesSerializer(serializers.Serializer):
    category = serializers.CharField()
    items = SubServiceSerializer(many=True)

# ✅ Service serializer with image and grouped subservices
class ServiceSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    grouped_subservices = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = [
            'id',
            'name',
            'description',
            'price',
            'image',
            'image_url',
            'grouped_subservices',
        ]

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

# ✅ Booking serializer
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
