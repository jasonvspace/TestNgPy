from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from .models import Project
from .models import ToDo
from .serializers import ProjectSerializer
from .serializers import ToDoSerializer
from rest_framework.permissions import IsAuthenticated


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

class ToDoViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = ToDoSerializer
    queryset = ToDo.objects.all()
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'description']
    filterset_fields = ['project']
