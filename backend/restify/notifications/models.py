from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from reservations.models import Reservation


# Create your models here.
class Notif(models.Model): 
    reservation = models.ForeignKey(Reservation, on_delete=models.SET_NULL, null=True, blank=True)
    action_choices = [('cancel-request', 'cancel-request'), ('new-reservation', 'new-reservation'), ('cancel-approve', 'cancel-approve'), 
                      ('request-approve', 'request-approve'), ('cancel-deny', 'cancel-deny'), ('request-deny', 'request-deny')]
    action = models.CharField(max_length=15, null=True, blank=True, choices=action_choices)
    display = models.CharField(default='A change has occurred', max_length=255, null=False, blank=False)
    priority = models.PositiveSmallIntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(5)])
    state_choices = [('unread', 'unread'), ('read', 'read')]
    state = models.CharField(max_length=6, null=True, blank=True, choices=state_choices, default='unread')
    timestamp = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return self.action + " " + str(self.reservation) 