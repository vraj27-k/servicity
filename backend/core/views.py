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
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import Booking, Service, Payment
from .ml_model import predict

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
class MLPredictionAPIView(APIView):
    def post(self, request):
        val = float(request.data.get('value', 0))
        result = predict(val)
        return Response({"prediction": result})
class AdminStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'admin':
            return Response({"error": "Admin access required"}, status=403)
        
        stats = {
            'totalUsers': User.objects.count(),
            'totalBookings': Booking.objects.count(),
            'totalServices': Service.objects.count(),
            'totalRevenue': Payment.objects.aggregate(
                total=models.Sum('amount')
            )['total'] or 0
        }
        
        return Response(stats)
# backend/myapp/views.py
# backend/core/views.py
# backend/core/views.py
# backend/core/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.db.models import Sum, Count
from .models import Booking, Service, Payment
from datetime import datetime, date, timedelta
from django.utils import timezone
import calendar

User = get_user_model()

class AdminStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'admin':
            return Response({"error": "Admin access required"}, status=403)
        
        try:
            today = date.today()
            
            # Auto-complete past pending bookings
            past_pending_bookings = Booking.objects.filter(
                date__lt=today,
                status__in=['pending', 'Pending', 'PENDING', 'confirmed', 'Confirmed']
            )
            updated_count = past_pending_bookings.update(status='completed')
            
            # Basic stats (your existing code)
            total_users = User.objects.count()
            total_bookings = Booking.objects.count()
            total_services = Service.objects.count()
            
            pending_bookings = Booking.objects.filter(status__in=['pending', 'Pending', 'PENDING']).count()
            completed_bookings = Booking.objects.filter(status__in=['completed', 'Completed', 'COMPLETED']).count()
            cancelled_bookings = Booking.objects.filter(status__in=['cancelled', 'Cancelled', 'CANCELLED']).count()
            today_bookings = Booking.objects.filter(date=today).count()
            upcoming_bookings = Booking.objects.filter(date__gt=today).exclude(status__in=['cancelled', 'Cancelled', 'CANCELLED']).count()
            
            total_revenue = Payment.objects.aggregate(total=Sum('amount'))['total'] or 0
            
            # NEW: Generate prediction data
            prediction_data = self.generate_prediction_data()
            
            # Get recent and upcoming bookings (your existing code)
            recent_bookings = list(
                Booking.objects.select_related('user', 'service')
                .order_by('-date')[:15]
                .values('id', 'user__username', 'user__email', 'service__name', 'status', 'date')
            )
            
            upcoming_bookings_list = list(
                Booking.objects.select_related('user', 'service')
                .filter(date__gt=today)
                .exclude(status__in=['cancelled', 'Cancelled', 'CANCELLED'])
                .order_by('date')[:10]
                .values('id', 'user__username', 'user__email', 'service__name', 'status', 'date')
            )
            
            return Response({
                'totalUsers': total_users,
                'totalBookings': total_bookings,
                'totalServices': total_services,
                'totalRevenue': float(total_revenue),
                'pendingBookings': pending_bookings,
                'completedBookings': completed_bookings,
                'cancelledBookings': cancelled_bookings,
                'todayBookings': today_bookings,
                'upcomingBookings': upcoming_bookings,
                'recentBookings': recent_bookings,
                'upcomingBookingsList': upcoming_bookings_list,
                'autoCompletedCount': updated_count,
                'predictionData': prediction_data,  # NEW: Prediction data
                'lastUpdated': timezone.now().isoformat(),
            })
            
        except Exception as e:
            print(f"Error in AdminStatsAPIView: {str(e)}")
            return Response({
                "error": f"Error fetching stats: {str(e)}",
                "totalUsers": 0,
                "totalBookings": 0,
                "totalServices": 0,
                "totalRevenue": 0,
                "predictionData": {}
            })
    
    def generate_prediction_data(self):
        """Generate prediction data for charts"""
        today = date.today()
        
        # Get last 6 months of actual data
        six_months_ago = today - timedelta(days=180)
        
        monthly_data = []
        revenue_data = []
        
        # Historical data (last 6 months)
        for i in range(6):
            month_start = (today.replace(day=1) - timedelta(days=i*30)).replace(day=1)
            month_end = (month_start + timedelta(days=31)).replace(day=1) - timedelta(days=1)
            
            bookings_count = Booking.objects.filter(
                date__gte=month_start,
                date__lte=month_end,
                status__in=['completed', 'Completed']
            ).count()
            
            month_revenue = Payment.objects.filter(
                booking__date__gte=month_start,
                booking__date__lte=month_end
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            monthly_data.insert(0, {
                'month': calendar.month_name[month_start.month],
                'year': month_start.year,
                'bookings': bookings_count,
                'revenue': float(month_revenue),
                'type': 'actual'
            })
        
        # Simple prediction logic (you can enhance this)
        # Calculate average growth rate from last 3 months
        if len(monthly_data) >= 3:
            recent_bookings = [month['bookings'] for month in monthly_data[-3:]]
            avg_bookings = sum(recent_bookings) / len(recent_bookings)
            growth_rate = 0.1  # Assume 10% growth (you can make this smarter)
            
            recent_revenue = [month['revenue'] for month in monthly_data[-3:]]
            avg_revenue = sum(recent_revenue) / len(recent_revenue)
        else:
            avg_bookings = 10  # Default
            avg_revenue = 5000  # Default
            growth_rate = 0.1
        
        # Generate next 3 months predictions
        for i in range(1, 4):
            future_date = today + timedelta(days=i*30)
            predicted_bookings = int(avg_bookings * (1 + growth_rate * i))
            predicted_revenue = avg_revenue * (1 + growth_rate * i)
            
            monthly_data.append({
                'month': calendar.month_name[future_date.month],
                'year': future_date.year,
                'bookings': predicted_bookings,
                'revenue': float(predicted_revenue),
                'type': 'predicted'
            })
        
        # Weekly trend data for the next 4 weeks
        weekly_predictions = []
        for i in range(4):
            week_start = today + timedelta(weeks=i)
            predicted_weekly_bookings = int(avg_bookings / 4 * (1 + growth_rate))
            
            weekly_predictions.append({
                'week': f"Week {i+1}",
                'date': week_start.strftime('%Y-%m-%d'),
                'predictedBookings': predicted_weekly_bookings,
                'confidence': max(0.9 - (i * 0.1), 0.6)  # Decreasing confidence
            })
        
        # Service popularity prediction
        service_predictions = []
        services = Service.objects.all()
        
        for service in services:
            past_bookings = Booking.objects.filter(
                service=service,
                date__gte=six_months_ago,
                status__in=['completed', 'Completed']
            ).count()
            
            # Simple prediction: current popularity + 20% growth
            predicted_demand = int(past_bookings * 1.2)
            
            service_predictions.append({
                'serviceName': service.name,
                'currentDemand': past_bookings,
                'predictedDemand': predicted_demand,
                'growthRate': 20
            })
        
        return {
            'monthlyTrend': monthly_data,
            'weeklyPredictions': weekly_predictions,
            'servicePredictions': service_predictions,
            'summary': {
                'predictedGrowthRate': growth_rate * 100,
                'confidenceLevel': 85,
                'nextMonthBookings': int(avg_bookings * (1 + growth_rate)),
                'nextMonthRevenue': float(avg_revenue * (1 + growth_rate))
            }
        }

class AdminBookingsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'admin':
            return Response({"error": "Admin access required"}, status=403)
        
        try:
            page = int(request.GET.get('page', 1))
            limit = int(request.GET.get('limit', 20))
            status_filter = request.GET.get('status', '')
            
            offset = (page - 1) * limit
            
            bookings_query = Booking.objects.select_related('user', 'service')
            
            if status_filter:
                bookings_query = bookings_query.filter(status=status_filter)
            
            total_count = bookings_query.count()
            
            # Use 'date' instead of 'created_at'
            bookings = list(
                bookings_query
                .order_by('-date')[offset:offset + limit]  # Changed field name
                .values(
                    'id',
                    'user__username',
                    'user__email', 
                    'service__name',
                    'status',
                    'date',  # Changed from 'created_at' to 'date'
                    'user__phone'
                )
            )
            
            return Response({
                'bookings': bookings,
                'total': total_count,
                'page': page,
                'limit': limit,
                'hasNext': offset + limit < total_count,
                'hasPrev': page > 1
            })
            
        except Exception as e:
            return Response({"error": f"Error fetching bookings: {str(e)}"})

class AdminLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({
                "error": "Username and password are required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # First, check if user exists and get their role from database
            user_obj = User.objects.get(username=username)
            
            # Check if user has admin role in database
            if user_obj.role != 'admin':
                return Response({
                    "error": f"Access denied. User '{username}' does not have admin privileges. Current role: {user_obj.role}"
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Now authenticate the user with password
            user = authenticate(username=username, password=password)
            
            if user:
                # Double check role after authentication
                if user.role == 'admin':
                    # Generate JWT tokens
                    refresh = RefreshToken.for_user(user)
                    
                    return Response({
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                        "username": user.username,
                        "role": user.role,
                        "id": user.id,
                        "email": user.email,
                        "message": f"Admin login successful! Welcome {user.username}"
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        "error": "Role verification failed after authentication"
                    }, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({
                    "error": "Invalid password for admin user"
                }, status=status.HTTP_401_UNAUTHORIZED)
                
        except User.DoesNotExist:
            return Response({
                "error": f"User '{username}' not found in database"
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                "error": f"Server error: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)