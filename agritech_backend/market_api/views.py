from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils import timezone
from datetime import datetime, timedelta
import json
import logging

from .models import (
    UserProfile, SoilAnalysis, CropRecommendation, 
    PestDetection, MarketPrice, WeatherData, Notification
)
from .serializers import (
    UserProfileSerializer, SoilAnalysisSerializer, CropRecommendationSerializer,
    PestDetectionSerializer, MarketPriceSerializer, WeatherDataSerializer,
    NotificationSerializer, SoilAnalysisCreateSerializer, CropRecommendationCreateSerializer,
    PestDetectionCreateSerializer, MarketPriceFilterSerializer, WeatherDataFilterSerializer,
    SoilAnalysisResultSerializer, CropRecommendationResultSerializer, PestDetectionResultSerializer
)
from .ai_services import SoilAnalysisService, CropRecommendationService, PestDetectionService

logger = logging.getLogger(__name__)

# User Profile Views
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

# Soil Analysis Views
class SoilAnalysisListCreateView(generics.ListCreateAPIView):
    serializer_class = SoilAnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SoilAnalysis.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SoilAnalysisDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SoilAnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SoilAnalysis.objects.filter(user=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def analyze_soil_image(request):
    """
    Analyze soil image using AI and return soil analysis results
    """
    try:
        serializer = SoilAnalysisCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Create soil analysis record
        soil_analysis = serializer.save(user=request.user)
        
        # Process image with AI service
        ai_service = SoilAnalysisService()
        analysis_result = ai_service.analyze_soil_image(soil_analysis.image.path)
        
        # Update soil analysis with AI results
        soil_analysis.soil_type = analysis_result.get('soil_type')
        soil_analysis.ph_level = analysis_result.get('ph_level')
        soil_analysis.moisture_content = analysis_result.get('moisture_content')
        soil_analysis.organic_matter = analysis_result.get('organic_matter')
        soil_analysis.nitrogen_content = analysis_result.get('nitrogen_content')
        soil_analysis.phosphorus_content = analysis_result.get('phosphorus_content')
        soil_analysis.potassium_content = analysis_result.get('potassium_content')
        soil_analysis.confidence_score = analysis_result.get('confidence_score')
        soil_analysis.analysis_status = 'completed'
        soil_analysis.save()

        # Generate crop recommendations
        crop_service = CropRecommendationService()
        recommendations = crop_service.get_crop_recommendations(analysis_result)
        
        # Save crop recommendations
        for rec_data in recommendations:
            CropRecommendation.objects.create(
                user=request.user,
                soil_analysis=soil_analysis,
                **rec_data
            )

        return Response({
            'soil_analysis': SoilAnalysisSerializer(soil_analysis).data,
            'crop_recommendations': recommendations
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Soil analysis error: {str(e)}")
        return Response(
            {'error': 'Failed to analyze soil image'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Crop Recommendation Views
class CropRecommendationListView(generics.ListAPIView):
    serializer_class = CropRecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CropRecommendation.objects.filter(user=self.request.user).order_by('-confidence_score')

class CropRecommendationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CropRecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CropRecommendation.objects.filter(user=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def save_crop_recommendation(request, recommendation_id):
    """
    Save a crop recommendation for future reference
    """
    try:
        recommendation = get_object_or_404(
            CropRecommendation, 
            id=recommendation_id, 
            user=request.user
        )
        recommendation.is_saved = True
        recommendation.save()
        
        return Response({'message': 'Recommendation saved successfully'})
    except Exception as e:
        logger.error(f"Save recommendation error: {str(e)}")
        return Response(
            {'error': 'Failed to save recommendation'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Pest Detection Views
class PestDetectionListCreateView(generics.ListCreateAPIView):
    serializer_class = PestDetectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PestDetection.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def detect_pest(request):
    """
    Detect pest in uploaded image using AI
    """
    try:
        serializer = PestDetectionCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Create pest detection record
        pest_detection = serializer.save(user=request.user)
        
        # Process image with AI service
        ai_service = PestDetectionService()
        detection_result = ai_service.detect_pest(pest_detection.image.path)
        
        # Update pest detection with AI results
        pest_detection.detected_pest = detection_result.get('detected_pest')
        pest_detection.detected_pest_hindi = detection_result.get('detected_pest_hindi')
        pest_detection.detected_pest_punjabi = detection_result.get('detected_pest_punjabi')
        pest_detection.confidence_score = detection_result.get('confidence_score')
        pest_detection.severity = detection_result.get('severity')
        pest_detection.treatment_advice = detection_result.get('treatment_advice')
        pest_detection.treatment_advice_hindi = detection_result.get('treatment_advice_hindi')
        pest_detection.treatment_advice_punjabi = detection_result.get('treatment_advice_punjabi')
        pest_detection.prevention_tips = detection_result.get('prevention_tips')
        pest_detection.prevention_tips_hindi = detection_result.get('prevention_tips_hindi')
        pest_detection.prevention_tips_punjabi = detection_result.get('prevention_tips_punjabi')
        pest_detection.detection_status = 'completed'
        pest_detection.save()

        return Response(PestDetectionSerializer(pest_detection).data)

    except Exception as e:
        logger.error(f"Pest detection error: {str(e)}")
        return Response(
            {'error': 'Failed to detect pest'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Market Price Views
class MarketPriceListView(generics.ListAPIView):
    serializer_class = MarketPriceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = MarketPrice.objects.filter(is_active=True)
        
        # Apply filters
        crop_name = self.request.query_params.get('crop_name')
        state = self.request.query_params.get('state')
        district = self.request.query_params.get('district')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if crop_name:
            queryset = queryset.filter(
                Q(crop_name__icontains=crop_name) |
                Q(crop_name_hindi__icontains=crop_name) |
                Q(crop_name_punjabi__icontains=crop_name)
            )
        
        if state:
            queryset = queryset.filter(
                Q(state__icontains=state) |
                Q(state_hindi__icontains=state) |
                Q(state_punjabi__icontains=state)
            )
        
        if district:
            queryset = queryset.filter(
                Q(district__icontains=district) |
                Q(district_hindi__icontains=district) |
                Q(district_punjabi__icontains=district)
            )
        
        if date_from:
            queryset = queryset.filter(price_date__gte=date_from)
        
        if date_to:
            queryset = queryset.filter(price_date__lte=date_to)
        
        return queryset.order_by('-price_date', '-created_at')

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_market_prices_summary(request):
    """
    Get summary of market prices for dashboard
    """
    try:
        # Get top crops by price
        top_crops = MarketPrice.objects.filter(
            is_active=True,
            price_date__gte=timezone.now().date() - timedelta(days=7)
        ).order_by('-price')[:10]
        
        # Get price trends
        price_trends = {}
        for crop in MarketPrice.objects.filter(is_active=True).values('crop_name').distinct():
            crop_name = crop['crop_name']
            prices = MarketPrice.objects.filter(
                crop_name=crop_name,
                price_date__gte=timezone.now().date() - timedelta(days=30)
            ).order_by('price_date')
            
            if prices.exists():
                price_trends[crop_name] = {
                    'current_price': prices.last().price,
                    'trend': 'up' if prices.count() > 1 and prices.last().price > prices.first().price else 'down'
                }
        
        return Response({
            'top_crops': MarketPriceSerializer(top_crops, many=True).data,
            'price_trends': price_trends
        })
    except Exception as e:
        logger.error(f"Market prices summary error: {str(e)}")
        return Response(
            {'error': 'Failed to get market prices summary'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Weather Data Views
class WeatherDataListView(generics.ListAPIView):
    serializer_class = WeatherDataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = WeatherData.objects.all()
        
        location = self.request.query_params.get('location')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        
        return queryset.order_by('-date', '-created_at')

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_current_weather(request):
    """
    Get current weather data for user's location
    """
    try:
        user_profile = UserProfile.objects.get(user=request.user)
        location = user_profile.location or 'New Delhi'
        
        weather_data = WeatherData.objects.filter(
            location__icontains=location
        ).order_by('-date').first()
        
        if weather_data:
            return Response(WeatherDataSerializer(weather_data).data)
        else:
            # Return mock data if no weather data available
            return Response({
                'location': location,
                'temperature': 28.0,
                'humidity': 65.0,
                'rainfall': 2.0,
                'wind_speed': 10.0,
                'weather_condition': 'Partly Cloudy',
                'date': timezone.now().date()
            })
    except Exception as e:
        logger.error(f"Current weather error: {str(e)}")
        return Response(
            {'error': 'Failed to get weather data'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Notification Views
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_notification_read(request, notification_id):
    """
    Mark a notification as read
    """
    try:
        notification = get_object_or_404(
            Notification, 
            id=notification_id, 
            user=request.user
        )
        notification.is_read = True
        notification.save()
        
        return Response({'message': 'Notification marked as read'})
    except Exception as e:
        logger.error(f"Mark notification read error: {str(e)}")
        return Response(
            {'error': 'Failed to mark notification as read'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Dashboard API
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_data(request):
    """
    Get dashboard data for authenticated user
    """
    try:
        user = request.user
        
        # Get recent soil analyses
        recent_soil_analyses = SoilAnalysis.objects.filter(
            user=user
        ).order_by('-created_at')[:5]
        
        # Get saved crop recommendations
        saved_recommendations = CropRecommendation.objects.filter(
            user=user, 
            is_saved=True
        ).order_by('-created_at')[:10]
        
        # Get recent pest detections
        recent_pest_detections = PestDetection.objects.filter(
            user=user
        ).order_by('-created_at')[:5]
        
        # Get unread notifications
        unread_notifications = Notification.objects.filter(
            user=user, 
            is_read=False
        ).order_by('-created_at')[:5]
        
        # Get current weather
        user_profile = UserProfile.objects.get(user=user)
        location = user_profile.location or 'New Delhi'
        weather_data = WeatherData.objects.filter(
            location__icontains=location
        ).order_by('-date').first()
        
        return Response({
            'recent_soil_analyses': SoilAnalysisSerializer(recent_soil_analyses, many=True).data,
            'saved_recommendations': CropRecommendationSerializer(saved_recommendations, many=True).data,
            'recent_pest_detections': PestDetectionSerializer(recent_pest_detections, many=True).data,
            'unread_notifications': NotificationSerializer(unread_notifications, many=True).data,
            'weather_data': WeatherDataSerializer(weather_data).data if weather_data else None,
            'user_profile': UserProfileSerializer(user_profile).data
        })
    except Exception as e:
        logger.error(f"Dashboard data error: {str(e)}")
        return Response(
            {'error': 'Failed to get dashboard data'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )