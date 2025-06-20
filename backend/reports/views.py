from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Report
from .serializers import ReportSerializer
from .permissions import IsAnalystOrReadOnly, IsReportOwnerOrReadOnly
from django.db.models import Prefetch
from teams.models import Team

class ReportListCreateView(generics.ListCreateAPIView):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsAnalystOrReadOnly]

    def get_queryset(self):
        queryset = Report.objects.select_related('team', 'author').all()
        
        if self.request.user.role == 'analyst':
            queryset = queryset.filter(author=self.request.user)
            
        return queryset.order_by('-updated_at')

    def perform_create(self, serializer):
        try:
            serializer.save(author=self.request.user)
        except Exception as e:
            print(f"Error creating report: {str(e)}")
            raise

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error listing reports: {str(e)}")
            return Response(
                {"detail": "Error fetching reports. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsReportOwnerOrReadOnly]

    def get_queryset(self):
        return Report.objects.select_related('team', 'author').all()

# ... rest of your existing views ... 