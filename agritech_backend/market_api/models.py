from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    language_preference = models.CharField(max_length=10, default='en', choices=[
        ('en', 'English'),
        ('hi', 'Hindi'),
        ('pa', 'Punjabi'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.location}"

class SoilAnalysis(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='soil_analyses')
    image = models.ImageField(upload_to='soil_images/')
    soil_type = models.CharField(max_length=50, blank=True, null=True)
    ph_level = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(14.0)],
        blank=True, null=True
    )
    moisture_content = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        blank=True, null=True
    )
    organic_matter = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        blank=True, null=True
    )
    nitrogen_content = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        blank=True, null=True
    )
    phosphorus_content = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        blank=True, null=True
    )
    potassium_content = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        blank=True, null=True
    )
    location = models.CharField(max_length=100, blank=True, null=True)
    season = models.CharField(max_length=20, blank=True, null=True)
    confidence_score = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        blank=True, null=True
    )
    analysis_status = models.CharField(max_length=20, default='pending', choices=[
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Soil Analysis {self.id} - {self.user.username}"

class CropRecommendation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='crop_recommendations')
    soil_analysis = models.ForeignKey(SoilAnalysis, on_delete=models.CASCADE, related_name='recommendations')
    crop_name = models.CharField(max_length=100)
    crop_name_hindi = models.CharField(max_length=100, blank=True, null=True)
    crop_name_punjabi = models.CharField(max_length=100, blank=True, null=True)
    season = models.CharField(max_length=20)
    season_hindi = models.CharField(max_length=20, blank=True, null=True)
    season_punjabi = models.CharField(max_length=20, blank=True, null=True)
    confidence_score = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)]
    )
    suitability = models.CharField(max_length=20, choices=[
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('moderate', 'Moderate'),
        ('poor', 'Poor'),
    ])
    expected_yield = models.CharField(max_length=100, blank=True, null=True)
    expected_yield_hindi = models.CharField(max_length=100, blank=True, null=True)
    expected_yield_punjabi = models.CharField(max_length=100, blank=True, null=True)
    planting_time = models.CharField(max_length=100, blank=True, null=True)
    planting_time_hindi = models.CharField(max_length=100, blank=True, null=True)
    planting_time_punjabi = models.CharField(max_length=100, blank=True, null=True)
    water_requirement = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ])
    soil_type_suitable = models.CharField(max_length=50, blank=True, null=True)
    soil_type_suitable_hindi = models.CharField(max_length=50, blank=True, null=True)
    soil_type_suitable_punjabi = models.CharField(max_length=50, blank=True, null=True)
    market_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    price_unit = models.CharField(max_length=20, default='per_quintal')
    benefits = models.JSONField(default=list, blank=True)
    benefits_hindi = models.JSONField(default=list, blank=True)
    benefits_punjabi = models.JSONField(default=list, blank=True)
    is_saved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-confidence_score', '-created_at']

    def __str__(self):
        return f"{self.crop_name} - {self.user.username}"

class PestDetection(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pest_detections')
    image = models.ImageField(upload_to='pest_images/')
    detected_pest = models.CharField(max_length=100, blank=True, null=True)
    detected_pest_hindi = models.CharField(max_length=100, blank=True, null=True)
    detected_pest_punjabi = models.CharField(max_length=100, blank=True, null=True)
    confidence_score = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        blank=True, null=True
    )
    severity = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ], blank=True, null=True)
    treatment_advice = models.TextField(blank=True, null=True)
    treatment_advice_hindi = models.TextField(blank=True, null=True)
    treatment_advice_punjabi = models.TextField(blank=True, null=True)
    prevention_tips = models.TextField(blank=True, null=True)
    prevention_tips_hindi = models.TextField(blank=True, null=True)
    prevention_tips_punjabi = models.TextField(blank=True, null=True)
    detection_status = models.CharField(max_length=20, default='pending', choices=[
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Pest Detection {self.id} - {self.user.username}"

class MarketPrice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    crop_name = models.CharField(max_length=100)
    crop_name_hindi = models.CharField(max_length=100, blank=True, null=True)
    crop_name_punjabi = models.CharField(max_length=100, blank=True, null=True)
    market_name = models.CharField(max_length=100)
    market_name_hindi = models.CharField(max_length=100, blank=True, null=True)
    market_name_punjabi = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=50)
    state_hindi = models.CharField(max_length=50, blank=True, null=True)
    state_punjabi = models.CharField(max_length=50, blank=True, null=True)
    district = models.CharField(max_length=50)
    district_hindi = models.CharField(max_length=50, blank=True, null=True)
    district_punjabi = models.CharField(max_length=50, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20, default='quintal')
    unit_hindi = models.CharField(max_length=20, default='क्विंटल', blank=True, null=True)
    unit_punjabi = models.CharField(max_length=20, default='ਕੁਇੰਟਲ', blank=True, null=True)
    price_date = models.DateField()
    source = models.CharField(max_length=100, default='e-NAM')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-price_date', '-created_at']
        unique_together = ['crop_name', 'market_name', 'price_date']

    def __str__(self):
        return f"{self.crop_name} - {self.market_name} - {self.price_date}"

class WeatherData(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    location = models.CharField(max_length=100)
    temperature = models.FloatField()
    humidity = models.FloatField()
    rainfall = models.FloatField()
    wind_speed = models.FloatField()
    weather_condition = models.CharField(max_length=50)
    weather_condition_hindi = models.CharField(max_length=50, blank=True, null=True)
    weather_condition_punjabi = models.CharField(max_length=50, blank=True, null=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']
        unique_together = ['location', 'date']

    def __str__(self):
        return f"Weather - {self.location} - {self.date}"

class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    title_hindi = models.CharField(max_length=200, blank=True, null=True)
    title_punjabi = models.CharField(max_length=200, blank=True, null=True)
    message = models.TextField()
    message_hindi = models.TextField(blank=True, null=True)
    message_punjabi = models.TextField(blank=True, null=True)
    notification_type = models.CharField(max_length=20, choices=[
        ('price_alert', 'Price Alert'),
        ('weather_alert', 'Weather Alert'),
        ('pest_alert', 'Pest Alert'),
        ('general', 'General'),
    ])
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification - {self.user.username} - {self.title}"