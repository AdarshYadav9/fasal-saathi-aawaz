from rest_framework import serializers

class MarketPriceSerializer(serializers.Serializer):
    state = serializers.CharField(max_length=100)
    commodity = serializers.CharField(max_length=100)
    market = serializers.CharField(max_length=100)
    min_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    max_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    modal_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    date = serializers.DateField()
