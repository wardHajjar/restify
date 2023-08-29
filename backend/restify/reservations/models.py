from django.db import models
from accounts.models import RestifyUser
from properties.models import Property
from django.core.validators import MinValueValidator

# Create your models here.
class Reservation(models.Model): 
    guest = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, null=False, blank=False)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    guests = models.PositiveIntegerField(default=1, null=False, blank=False, validators=[MinValueValidator(1)])
    property = models.ForeignKey(Property, on_delete=models.CASCADE, null=False, blank=False)
    status_choices = [('pending', 'pending'), ('denied', 'denied'), ('cancel-pending', 'cancel-pending'), ('current', 'current'), ('completed', 'completed'), 
                      ('terminated', 'terminated'), ('approved', 'approved'), ('cancelled', 'cancelled')]
    status = models.CharField(max_length=14, default='pending', null=False, blank=False, choices=status_choices)

    def __str__(self):
        return str(self.guest) + " " + str(self.start_date) + "-" + str(self.end_date) + " " + str(self.property)