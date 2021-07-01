from django.db import models
# from django.db import DefaultConnectionProxy, models

class PriorityChoices(models.IntegerChoices):
    low = 1
    medium = 2
    high= 3

class Task(models.Model):
    # this is so I can track index(frontend) to stay orginized between frontend renders
    index = models.IntegerField()
    title = models.CharField(max_length=100, default='Unknown Task')
    # todo add default choice and migrate
    priority = models.IntegerField(choices=PriorityChoices.choices)
