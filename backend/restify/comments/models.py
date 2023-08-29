from django.db import models

# Create your models here.
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Comment(models.Model):
    commentor = models.ForeignKey('accounts.RestifyUser', on_delete=models.SET_NULL, blank=True, null=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    comment_choices = [('comment', 'comment'), ('user-reply', 'user-reply'), ('host-reply', 'host-reply') ]
    comment_type = models.CharField(max_length=10, choices=comment_choices, blank=True, null=True, default='comment')
    

    def __str__(self):
        return str(self.timestamp)