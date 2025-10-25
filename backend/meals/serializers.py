from rest_framework import serializers
from .models import Employee, Deposit, MealEntry, MealCost


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'name', 'type', 'created_at']


class DepositSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.name', read_only=True)
    
    class Meta:
        model = Deposit
        fields = ['id', 'employee', 'employee_name', 'amount', 'month', 'date']


class MealEntrySerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.name', read_only=True)
    
    class Meta:
        model = MealEntry
        fields = ['id', 'employee', 'employee_name', 'date', 'lunch', 'dinner']


class MealCostSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.name', read_only=True)
    
    class Meta:
        model = MealCost
        fields = ['id', 'employee', 'employee_name', 'date', 'total_meal_cost', 'meal_count', 'cost_per_meal']
