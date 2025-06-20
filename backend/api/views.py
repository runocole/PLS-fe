from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from .models import Team, Report
from .serializers import TeamSerializer, ReportSerializer

class IsAnalystOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role == 'analyst'

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role == 'analyst' and obj.author == request.user

class TeamCreate(generics.CreateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class ReportList(generics.ListCreateAPIView):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsAnalystOrReadOnly]

    def get_queryset(self):
        if self.request.user.role == 'coach':
            return Report.objects.all()
        return Report.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.role != 'analyst':
            raise PermissionDenied("Only analysts can create reports.")
        
        # Check if report already exists
        existing_report = Report.objects.filter(
            team_id=self.request.data.get('team'),
            author=self.request.user
        ).first()
        
        if existing_report:
            raise ValidationError("You have already created a report for this team.")
            
        serializer.save(author=self.request.user)

class ReportDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsAnalystOrReadOnly]

    def get_queryset(self):
        if self.request.user.role == 'coach':
            return Report.objects.all()
        return Report.objects.filter(author=self.request.user)

class TeamReportList(generics.ListAPIView):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        team_id = self.kwargs.get('team_id')
        if self.request.user.role == 'coach':
            return Report.objects.filter(team_id=team_id)
        return Report.objects.filter(team_id=team_id, author=self.request.user) 