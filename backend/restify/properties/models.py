from django.db import models
from accounts.models import RestifyUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.contenttypes.fields import GenericRelation
from comments.models import Comment

# Create your models here.
class Property(models.Model): 
    name = models.CharField(max_length=255, null=False, blank=False)
    address1 = models.CharField(max_length=255, null=False, blank=False)
    address2 = models.CharField(max_length=225, null=True, blank=True)
    city = models.CharField(max_length=255, null=False, blank=False, default="")
    country = models.CharField(max_length=255, null=False, blank=False, default="")
    postal_code = models.CharField(max_length=255, null=False, blank=False, default="")
    guests = models.PositiveIntegerField(default=1, null=False, blank=False, validators=[MinValueValidator(1)])
    rating = models.FloatField(validators=[MaxValueValidator(5)], blank=True, null=True)
    owner = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    pool = models.BooleanField(default=False, null=False, blank=False)
    bbq = models.BooleanField(default=False, null=False, blank=False)
    kitchen = models.BooleanField(default=False, null=False, blank=False)
    laundry = models.BooleanField(default=False, null=False, blank=False)
    parking = models.BooleanField(default=False, null=False, blank=False)
    wifi = models.BooleanField(default=False, null=False, blank=False)
    jacuzzi = models.BooleanField(default=False, null=False, blank=False)
    self_checkin = models.BooleanField(default=False, null=False, blank=False)
    pets = models.BooleanField(default=False, null=False, blank=False)
    heating = models.BooleanField(default=False, null=False, blank=False)
    bedrooms = models.PositiveIntegerField(default=1, null=False, blank=False)
    bathrooms = models.PositiveIntegerField(default=1, null=False, blank=False)
    available_from = models.DateField(null=True, blank=True)
    available_to = models.DateField(null=True, blank=True)
    price = models.FloatField(validators=[MinValueValidator(1)], null=True, blank=True)
    comments = GenericRelation(Comment, related_query_name='properties')

    def __str__(self):
        return self.name

# class Availability(models.Model):
#     start_date = models.DateField(null=False, blank=False)
#     end_date = models.DateField(null=False, blank=False)
#     price = models.FloatField(validators=[MinValueValidator(1)])
#     property = models.ForeignKey(Property, on_delete=models.CASCADE, null=False, blank=False)

#     def __str__(self): 
#         return self.start_date + "-" + self.end_date
