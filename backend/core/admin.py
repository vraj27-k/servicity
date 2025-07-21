from django.contrib import admin
from .models import Service, SubService, Booking,CustomUser

admin.site.register(Service)
admin.site.register(SubService)
admin.site.register(Booking)
admin.site.register(CustomUser)
