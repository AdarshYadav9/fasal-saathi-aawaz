from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    UserProfile, SoilAnalysis, CropRecommendation, 
    PestDetection, MarketPrice, WeatherData, Notification
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'phone_number', 'location', 'language_preference', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class SoilAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilAnalysis
        fields = [
            'id', 'image', 'soil_type', 'ph_level', 'moisture_content', 
            'organic_matter', 'nitrogen_content', 'phosphorus_content', 
            'potassium_content', 'location', 'season', 'confidence_score', 
            'analysis_status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class CropRecommendationSerializer(serializers.ModelSerializer):
    soil_analysis = SoilAnalysisSerializer(read_only=True)
    
    class Meta:
        model = CropRecommendation
        fields = [
            'id', 'soil_analysis', 'crop_name', 'crop_name_hindi', 'crop_name_punjabi',
            'season', 'season_hindi', 'season_punjabi', 'confidence_score', 'suitability',
            'expected_yield', 'expected_yield_hindi', 'expected_yield_punjabi',
            'planting_time', 'planting_time_hindi', 'planting_time_punjabi',
            'water_requirement', 'soil_type_suitable', 'soil_type_suitable_hindi', 
            'soil_type_suitable_punjabi', 'market_price', 'price_unit',
            'benefits', 'benefits_hindi', 'benefits_punjabi', 'is_saved',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class PestDetectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PestDetection
        fields = [
            'id', 'image', 'detected_pest', 'detected_pest_hindi', 'detected_pest_punjabi',
            'confidence_score', 'severity', 'treatment_advice', 'treatment_advice_hindi',
            'treatment_advice_punjabi', 'prevention_tips', 'prevention_tips_hindi',
            'prevention_tips_punjabi', 'detection_status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class MarketPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketPrice
        fields = [
            'id', 'crop_name', 'crop_name_hindi', 'crop_name_punjabi',
            'market_name', 'market_name_hindi', 'market_name_punjabi',
            'state', 'state_hindi', 'state_punjabi', 'district', 'district_hindi',
            'district_punjabi', 'price', 'unit', 'unit_hindi', 'unit_punjabi',
            'price_date', 'source', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class WeatherDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherData
        fields = [
            'id', 'location', 'temperature', 'humidity', 'rainfall', 'wind_speed',
            'weather_condition', 'weather_condition_hindi', 'weather_condition_punjabi',
            'date', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'title_hindi', 'title_punjabi', 'message', 'message_hindi',
            'message_punjabi', 'notification_type', 'is_read', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

# Serializers for API responses
class SoilAnalysisCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilAnalysis
        fields = ['image', 'location', 'season']

class CropRecommendationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropRecommendation
        fields = ['soil_analysis', 'crop_name', 'confidence_score', 'suitability']

class PestDetectionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PestDetection
        fields = ['image']

class MarketPriceFilterSerializer(serializers.Serializer):
    crop_name = serializers.CharField(required=False)
    state = serializers.CharField(required=False)
    district = serializers.CharField(required=False)
    date_from = serializers.DateField(required=False)
    date_to = serializers.DateField(required=False)

class WeatherDataFilterSerializer(serializers.Serializer):
    location = serializers.CharField(required=False)
    date_from = serializers.DateField(required=False)
    date_to = serializers.DateField(required=False)

# Serializers for AI model responses
class SoilAnalysisResultSerializer(serializers.Serializer):
    soil_type = serializers.CharField()
    ph_level = serializers.FloatField()
    moisture_content = serializers.FloatField()
    organic_matter = serializers.FloatField()
    nitrogen_content = serializers.FloatField()
    phosphorus_content = serializers.FloatField()
    potassium_content = serializers.FloatField()
    confidence_score = serializers.FloatField()

class CropRecommendationResultSerializer(serializers.Serializer):
    crop_name = serializers.CharField()
    crop_name_hindi = serializers.CharField()
    crop_name_punjabi = serializers.CharField()
    season = serializers.CharField()
    season_hindi = serializers.CharField()
    season_punjabi = serializers.CharField()
    confidence_score = serializers.FloatField()
    suitability = serializers.CharField()
    expected_yield = serializers.CharField()
    expected_yield_hindi = serializers.CharField()
    expected_yield_punjabi = serializers.CharField()
    planting_time = serializers.CharField()
    planting_time_hindi = serializers.CharField()
    planting_time_punjabi = serializers.CharField()
    water_requirement = serializers.CharField()
    soil_type_suitable = serializers.CharField()
    soil_type_suitable_hindi = serializers.CharField()
    soil_type_suitable_punjabi = serializers.CharField()
    market_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    price_unit = serializers.CharField()
    benefits = serializers.ListField(child=serializers.CharField())
    benefits_hindi = serializers.ListField(child=serializers.CharField())
    benefits_punjabi = serializers.ListField(child=serializers.CharField())

class PestDetectionResultSerializer(serializers.Serializer):
    detected_pest = serializers.CharField()
    detected_pest_hindi = serializers.CharField()
    detected_pest_punjabi = serializers.CharField()
    confidence_score = serializers.FloatField()
    severity = serializers.CharField()
    treatment_advice = serializers.CharField()
    treatment_advice_hindi = serializers.CharField()
    treatment_advice_punjabi = serializers.CharField()
    prevention_tips = serializers.CharField()
    prevention_tips_hindi = serializers.CharField()
    prevention_tips_punjabi = serializers.CharField()