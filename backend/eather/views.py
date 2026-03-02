from rest_framework.views import APIView
from rest_framework.response import Response
from eather.models import *
import re
from django.db import IntegrityError
from django.db.models import Avg, Case, When, IntegerField, Count
from rest_framework.decorators import api_view
from datetime import datetime



class EmployeeListView(APIView):
    
    def get(self, request):
        try:
            if request.query_params.get('date'):
                date = request.query_params.get('date')
                datetime_object = datetime.strptime(date, "%Y-%m-%d")
                employees = Employee.objects.filter(deleted_at__isnull=True, updated_at__date=datetime_object).order_by('-updated_at').values('id', 'full_name', 'email', 'department__name')
                return Response({'employees': employees})
            
            employees = Employee.objects.all().values('id', 'full_name', 'email', 'department__name').order_by('-updated_at')
            return Response({'employees': employees})
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    

    def post(self, request):

        try:
            full_name = request.data.get('name')
            email = request.data.get('email')
            department_id = request.data.get('dept')

            if not full_name or not email:
                return Response({'error': 'Full name and email are required'}, status=400)


            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, email):
                return Response({'error': 'Invalid email format'}, status=400)


            department = None
            if department_id:
                try:
                    department = Department.objects.get(pk=department_id)
                except Department.DoesNotExist:
                    return Response({'error': 'Department not found'}, status=404)

            employee = Employee.objects.create(full_name=full_name, email=email, department=department)
            data = {
                'id': employee.id,
                'name': employee.full_name,
                'email': employee.email,
                'dept': employee.department.name if employee.department else None
            }
            return Response({'employee': data}, status=201)
        
        except IntegrityError:
            return Response({'error': 'Employee with this email already exists'}, status=400)
        
        except Exception as e:
            return Response({'error': f"Something went wrong: {e}"}, status=500)
    

class EmployeeDetailView(APIView):

    def get(self, request, id):
        try:
            employee = Employee.objects.get(pk=id)
            data = {
                'id': employee.id,
                'full_name': employee.full_name,
                'email': employee.email,
                'department': employee.department.name if employee.department else None,
                "join_date": employee.created_at
            }
            return Response({'employee': data})
        except Employee.DoesNotExist:
            return Response({'error': 'Employee not found'}, status=404)
        except Exception as e:
            print(e)
            return Response({"error":"Something went wrong"})
        
    

    def put(self, request, id):
        try:
            employee = Employee.objects.get(pk=id)
    
            full_name = request.data.get('full_name')
            email = request.data.get('email')
            department_id = request.data.get('department_id')

            if full_name:
                employee.full_name = full_name
            if email:
                employee.email = email
            if department_id is not None:
                try:
                    department = Department.objects.get(pk=department_id)
                    employee.department = department
                except Department.DoesNotExist:
                    return Response({'error': 'Department not found'}, status=404)

            employee.save()
            data = {
                'id': employee.id,
                'full_name': employee.full_name,
                'email': employee.email,
                'department': employee.department.name if employee.department else None
            }
            return Response({'employee': data})
        
        except Employee.DoesNotExist:
                return Response({'error': 'Employee not found'}, status=404)
        
        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status=500)
    



    def delete(self, request, id):
        try:
            employee = Employee.objects.get(pk=id)
            employee.delete()
            return Response({'message': 'Employee deleted successfully'})
        except Employee.DoesNotExist:
            return Response({'error': 'Employee not found'}, status=404)
        

        

class AttendanceListView(APIView):

    def get(self, request, employee_id):

        try:
            if not employee_id:
                return Response({'error': 'employee_id is required'}, status=400)
            
            page = int(request.query_params.get('page', 1))
            page_size = int(request.query_params.get('page_size', 10))
            offset = (page - 1) * page_size

            attendance_records = Attendance.objects.filter(employee__id=employee_id).values('id', 'date', 'status', 'updated_at').order_by('-updated_at')[offset:offset + page_size]
            count = Attendance.objects.filter(employee__id=employee_id).count()
            return Response({'attendance_records': attendance_records, 'total_count': count})
        
        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status=500)
        
    def post(self, request, employee_id):

        try:
            date = request.data.get('date')
            status = request.data.get('status')
            if not employee_id or not date or status is None:
                return Response({'error': 'employee_id, date and status are required'}, status=400)

            try:
                employee = Employee.objects.get(pk=employee_id)
            except Employee.DoesNotExist:
                return Response({'error': 'Employee not found'}, status=404)

            attendance = Attendance.objects.create(employee=employee, date=date, status=status)
            data = {
                'id': attendance.id,
                'employee': attendance.employee.full_name,
                'date': attendance.date,
                'status': attendance.status
            }
            return Response({'attendance': data}, status=201)
        
        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status=500)
    
    def put(self, request, id):
        try:
            print(request.data.get('status'), "-------------")
            attendance = Attendance.objects.get(pk=id)
            attendance.status = request.data.get('status', attendance.status)
            attendance.save()
            data = {
                'id': attendance.id,
                'employee': attendance.employee.full_name,
                'date': attendance.date,
                'status': attendance.status
            }
            return Response({'attendance': data})
        except Attendance.DoesNotExist:
            return Response({'error': 'Attendance record not found'}, status=404)
        
        except Exception as e:
            print(e)
            return Response({'error': "Something went wrong"}, status=500)
        

    def delete(self, request, id):
        try:
            attendance = Attendance.objects.get(pk=id)
            attendance.delete()
            return Response({'message': 'Attendance record deleted successfully'})
        except Attendance.DoesNotExist:
            return Response({'error': 'Attendance record not found'}, status=404)
        
        except Exception as e:
            print(e)
            return Response({'error': "Something went wrong"}, status=500)


class DepartmentView(APIView):

    def get(self, request):

        try:
            departments = Department.objects.all().values('id', 'name', 'description')
            return Response({'departments': departments})
        
        except Exception as e:
            print(e)
            return Response({'error': "Something went wrong"}, status=500)
    
    def post(self, request):

        try:
            name = request.data.get('name')
            description = request.data.get('description')

            if not name:
                return Response({'error': 'Department name is required'}, status=400)

            department = Department.objects.create(name=name, description=description)
            data = {
                'id': department.id,
                'name': department.name,
                'description': department.description
            }
            return Response({'department': data}, status=201)
        
        except Exception as e:
            print(e)
            return Response({'error': "Something went wrong"}, status=500)
    
    def delete(self, request, id):
        try:
            department = Department.objects.get(pk=id)
            department.delete()
            return Response({'message': 'Department deleted successfully'})
        except Department.DoesNotExist:
            return Response({'error': 'Department not found'}, status=404)
        
        except Exception as e:
            print(e)
            return Response({'error': "Something went wrong"}, status=500)
        

class AttendanceStatisticsView(APIView):

    def get(self, request):
        try:
            statistics = Attendance.objects.filter(deleted_at__isnull=True).values('status').annotate(count=Count('id'))
            return Response({'statistics': statistics})
        
        except Exception as e:
            print(e)
            return Response({'error': "Something went wrong"}, status=500)
        

class StatisticsView(APIView):

    def get(self, request):
        try:
            data ={}

            total_employees = Employee.objects.filter(deleted_at__isnull=True).count()
            total_departments = Department.objects.filter(deleted_at__isnull=True).count()
            total_attendance_records = Attendance.objects.filter(deleted_at__isnull=True).count()
            avg_attendance_per_employee = avg_attendance_per_employee = (
                    Attendance.objects
                    .filter(deleted_at__isnull=True)
                    .values("employee")
                    .annotate(
                        avg_attendance=Avg(
                            Case(
                                When(status=True, then=1),
                                When(status=False, then=0),
                                output_field=IntegerField(),
                            )
                        )
                    )
                    .aggregate(average=Avg("avg_attendance"))
                )["average"]
            
            data.update({
                'total_employees': total_employees,
                'total_departments': total_departments,
                'total_attendance_records': total_attendance_records,
                'average_attendance_per_employee': avg_attendance_per_employee
            })
            return Response(data)
        
        except Exception as e:
            
            return Response({'error': "Something went wrong"}, status=500)
        

@api_view(['GET'])
def recent_attendence(request):
    try:
        recent_attendance = Attendance.objects.filter().prefetch_related('employee').order_by('-updated_at')[:10].values('id', 'date', 'status', 'employee__full_name', 'updated_at')
        return Response({'recentAttendance': recent_attendance})
    
    except Exception as e:
        print(e)
        return Response({'error': "Something went wrong"}, status=500)
    

#  Expected: { totalEmployees: 124, presentToday: 110, AbsentToday: 12, pending: 2 }
@api_view(['GET'])
def dashboar_stats(request):
    try:
        total_employees = Employee.objects.filter(deleted_at__isnull=True).count()
        present_today = Attendance.objects.filter(deleted_at__isnull=True, status='Present').count()
        on_leave = Attendance.objects.filter(deleted_at__isnull=True, status='On Leave').count()
        pending = Attendance.objects.filter(deleted_at__isnull=True, status='Absent').count()
        return Response({'totalEmployees': total_employees, 'presentToday': present_today, 'onLeave': on_leave, 'pending': pending})
    
    except Exception as e:
        print(e)
        return Response({'error': "Something went wrong"}, status=500)
    

# Expected: [{ name: 'Engineering', count: 65, total: 100 }, ...]
@api_view(['GET'])
def get_departments(request):
    try:
        total_employees = Employee.objects.count()
        stats = Department.objects.values('name') \
                                   .annotate(count=Count('employee')) \
                                   .order_by('-created_at')
        results = list(stats)
        for entry in results:
            entry['total'] = total_employees

        return Response({'stats': results})
    except Exception as e:
        print(e)
        return Response({'error': "Something went wrong"}, status=500)
    

@api_view(['GET'])
def get_attandances(request):
    try:
        date = request.query_params.get('date')
        datetime_object = datetime.strptime(date, "%Y-%m-%d")
        attendances = Attendance.objects.filter(deleted_at__isnull=True, date=datetime_object).prefetch_related('employee').order_by('-updated_at').values('id', 'employee__full_name', 'employee__id', 'date', 'status')
        return Response({'attendances': attendances})

    except Exception as e:
        print(e)
        return Response({'error': "Something went wrong"}, status=500)