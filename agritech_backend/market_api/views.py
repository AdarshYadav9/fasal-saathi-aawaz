from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import MarketPriceSerializer
from datetime import date

# Create your views here.

class MarketPriceListView(APIView):
    def get(self, request, *args, **kwargs):
        # Mock data for top 10 states (example data, replace with actual API call later)
        mock_market_data = [
            {'state': 'Maharashtra', 'commodity': 'Onion', 'market': 'Nashik', 'min_price': 1500.00, 'max_price': 2000.00, 'modal_price': 1750.00, 'date': date.today()},
            {'state': 'Uttar Pradesh', 'commodity': 'Potato', 'market': 'Agra', 'min_price': 1200.00, 'max_price': 1600.00, 'modal_price': 1400.00, 'date': date.today()},
            {'state': 'Punjab', 'commodity': 'Wheat', 'market': 'Ludhiana', 'min_price': 2200.00, 'max_price': 2500.00, 'modal_price': 2350.00, 'date': date.today()},
            {'state': 'Haryana', 'commodity': 'Basmati Rice', 'market': 'Karnal', 'min_price': 3000.00, 'max_price': 3500.00, 'modal_price': 3250.00, 'date': date.today()},
            {'state': 'Madhya Pradesh', 'commodity': 'Soybean', 'market': 'Indore', 'min_price': 4500.00, 'max_price': 5000.00, 'modal_price': 4750.00, 'date': date.today()},
            {'state': 'Rajasthan', 'commodity': 'Mustard', 'market': 'Jaipur', 'min_price': 5500.00, 'max_price': 6000.00, 'modal_price': 5750.00, 'date': date.today()},
            {'state': 'Karnataka', 'commodity': 'Coffee', 'market': 'Chikmagalur', 'min_price': 10000.00, 'max_price': 12000.00, 'modal_price': 11000.00, 'date': date.today()},
            {'state': 'Andhra Pradesh', 'commodity': 'Chilli', 'market': 'Guntur', 'min_price': 7000.00, 'max_price': 8000.00, 'modal_price': 7500.00, 'date': date.today()},
            {'state': 'Gujarat', 'commodity': 'Cotton', 'market': 'Ahmedabad', 'min_price': 6000.00, 'max_price': 6500.00, 'modal_price': 6250.00, 'date': date.today()},
            {'state': 'West Bengal', 'commodity': 'Jute', 'market': 'Kolkata', 'min_price': 4000.00, 'max_price': 4500.00, 'modal_price': 4250.00, 'date': date.today()},
        ]
        serializer = MarketPriceSerializer(mock_market_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
