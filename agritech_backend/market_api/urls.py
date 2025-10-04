from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for API endpoints
router = DefaultRouter()

urlpatterns = [
    # User Profile
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    
    # Soil Analysis
    path('soil-analysis/', views.SoilAnalysisListCreateView.as_view(), name='soil-analysis-list'),
    path('soil-analysis/<uuid:pk>/', views.SoilAnalysisDetailView.as_view(), name='soil-analysis-detail'),
    path('analyze-soil/', views.analyze_soil_image, name='analyze-soil'),
    
    # Crop Recommendations
    path('crop-recommendations/', views.CropRecommendationListView.as_view(), name='crop-recommendations-list'),
    path('crop-recommendations/<uuid:pk>/', views.CropRecommendationDetailView.as_view(), name='crop-recommendations-detail'),
    path('crop-recommendations/<uuid:recommendation_id>/save/', views.save_crop_recommendation, name='save-crop-recommendation'),
    
    # Pest Detection
    path('pest-detection/', views.PestDetectionListCreateView.as_view(), name='pest-detection-list'),
    path('detect-pest/', views.detect_pest, name='detect-pest'),
    
    # Market Prices
    path('market-prices/', views.MarketPriceListView.as_view(), name='market-prices-list'),
    path('market-prices/summary/', views.get_market_prices_summary, name='market-prices-summary'),
    
    # Weather Data
    path('weather/', views.WeatherDataListView.as_view(), name='weather-list'),
    path('weather/current/', views.get_current_weather, name='current-weather'),
    
    # Notifications
    path('notifications/', views.NotificationListView.as_view(), name='notifications-list'),
    path('notifications/<uuid:notification_id>/read/', views.mark_notification_read, name='mark-notification-read'),
    
    # Dashboard
    path('dashboard/', views.dashboard_data, name='dashboard-data'),
]

# Include router URLs
urlpatterns += router.urls