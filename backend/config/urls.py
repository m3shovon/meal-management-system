"""
URL configuration for meal management project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from meals.views import EmployeeViewSet, DepositViewSet, MealEntryViewSet, MealCostViewSet

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'deposits', DepositViewSet, basename='deposit')
router.register(r'meal-entries', MealEntryViewSet, basename='meal-entry')
router.register(r'meal-costs', MealCostViewSet, basename='meal-cost')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
