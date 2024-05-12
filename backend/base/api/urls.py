
from django.urls import path
from . import views
from .views import MyTokenObtainPairView ,Weapon

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('profile/', views.get_profile),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('weapon',Weapon.as_view()) ,
    path('run_roulette',views.run_roulette),
]
