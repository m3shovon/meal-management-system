from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from .models import Employee, Deposit, MealEntry, MealCost
from .serializers import EmployeeSerializer, DepositSerializer, MealEntrySerializer, MealCostSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


class DepositViewSet(viewsets.ModelViewSet):
    queryset = Deposit.objects.all()
    serializer_class = DepositSerializer
    
    @action(detail=False, methods=['get'])
    def by_employee_month(self, request):
        employee_id = request.query_params.get('employee_id')
        month = request.query_params.get('month')
        
        deposits = Deposit.objects.filter(employee_id=employee_id, month=month)
        serializer = self.get_serializer(deposits, many=True)
        return Response(serializer.data)


class MealEntryViewSet(viewsets.ModelViewSet):
    queryset = MealEntry.objects.all()
    serializer_class = MealEntrySerializer
    
    @action(detail=False, methods=['get'])
    def by_date(self, request):
        date = request.query_params.get('date')
        entries = MealEntry.objects.filter(date=date)
        serializer = self.get_serializer(entries, many=True)
        return Response(serializer.data)


class MealCostViewSet(viewsets.ModelViewSet):
    queryset = MealCost.objects.all()
    serializer_class = MealCostSerializer
    
    @action(detail=False, methods=['get'])
    def by_employee_month(self, request):
        employee_id = request.query_params.get('employee_id')
        month = request.query_params.get('month')
        
        costs = MealCost.objects.filter(employee_id=employee_id, date__startswith=month)
        total = costs.aggregate(Sum('total_meal_cost'))['total_meal_cost__sum'] or 0
        
        serializer = self.get_serializer(costs, many=True)
        return Response({
            'costs': serializer.data,
            'total': total
        })
