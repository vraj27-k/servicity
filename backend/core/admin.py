from django.contrib import admin
from .models import Service, SubService, Booking, Employee, CustomUser

admin.site.register(Service)
admin.site.register(SubService)
admin.site.register(Booking)
admin.site.register(Employee)
admin.site.register(CustomUser)
