from django.db import models

# Create your models here.
from django.db import models

class Project(models.Model):
    title = models.TextField()
    description = models.TextField()
    active = models.BooleanField()

class ToDo(models.Model):
    title = models.TextField()
    description = models.TextField()
    project = models.ForeignKey(Project, related_name='todos', on_delete=models.CASCADE)
    active = models.BooleanField()