from django.urls import path
from eather.views import *


urlpatterns = [
    path('employees/', EmployeeListView.as_view(), name='employee-list'),
    path('departments/', DepartmentView.as_view(), name='department-list'),
    path('departments/<int:id>/', DepartmentView.as_view(), name='department-detail'),
    path('employees/<int:id>/', EmployeeDetailView.as_view(), name='employee-detail'),
    path('attendance/', AttendanceListView.as_view(), name='attendance-list'),
    path('attendance/<int:employee_id>/', AttendanceListView.as_view(), name='employee-attendance'),
    path('attendance/update/<int:id>/', AttendanceListView.as_view(), name='attendance-update'),
    path('attendance/delete/<int:id>/', AttendanceListView.as_view(), name='attendance-delete'),
    path('statistics/attendance/', AttendanceStatisticsView.as_view(), name='attendance-statistics'),
    path('statistics/', StatisticsView.as_view(), name='department-statistics'),
    path('attendance/recent/', recent_attendence, name='employee-attendance-statistics'),
    path('dashboard/stats', dashboar_stats, name='dashboard-stata'),
    path('departments/stats', get_departments, name='departments-stats')
]