from django.contrib import admin

# Register your models here.

from .models import CustomUser, Service,SubService, Booking



admin.site.register(SubService)
admin.site.register(Booking)

admin.site.register(CustomUser)

