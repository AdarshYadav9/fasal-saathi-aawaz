from django.urls import path
from .views import MarketPriceListView

urlpatterns = [
    path('prices/', MarketPriceListView.as_view(), name='market-prices'),
]
