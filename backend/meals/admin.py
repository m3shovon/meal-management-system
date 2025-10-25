from django.contrib import admin
from .models import Employee, Deposit, MealEntry, MealCost

admin.site.register(Employee)
admin.site.register(Deposit)
admin.site.register(MealEntry)
admin.site.register(MealCost)
