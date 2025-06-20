from django.urls import path
from .views import (
    TeamCreate,
    ReportList,
    ReportDetail,
    TeamReportList,
)

# ... existing code ...

urlpatterns = [
    # ... existing urls ...
    path('teams/', TeamCreate.as_view(), name='team-create'),
    path('teams/<int:pk>/', TeamCreate.as_view(), name='team-detail'),
    path('reports/', ReportList.as_view(), name='report-list'),
    path('reports/<int:pk>/', ReportDetail.as_view(), name='report-detail'),
    path('reports/team/<int:team_id>/', TeamReportList.as_view(), name='team-reports'),
] 