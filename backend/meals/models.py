from django.db import models
from django.core.validators import MinValueValidator

class Employee(models.Model):
    EMPLOYEE_TYPES = [
        ('regular', 'Regular'),
        ('irregular', 'Irregular'),
        ('guest', 'Guest'),
    ]
    
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=EMPLOYEE_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.type})"


class Deposit(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='deposits')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    month = models.CharField(max_length=7)  # Format: YYYY-MM
    date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.employee.name} - {self.month}: {self.amount}"


class MealEntry(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='meal_entries')
    date = models.DateField()
    lunch = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    dinner = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    
    class Meta:
        ordering = ['-date']
        unique_together = ('employee', 'date')
    
    def __str__(self):
        return f"{self.employee.name} - {self.date}"


class MealCost(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='meal_costs')
    date = models.DateField()
    total_meal_cost = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    meal_count = models.IntegerField(validators=[MinValueValidator(0)])
    cost_per_meal = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.employee.name} - {self.date}: {self.total_meal_cost}"
