from rest_framework import serializers
from .models import Project
from .models import ToDo

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class ToDoSerializer(serializers.ModelSerializer):
    project = ProjectSerializer
    class Meta:
        model = ToDo
        fields = '__all__'