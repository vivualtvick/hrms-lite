import { useQuery } from "@tanstack/react-query";
import { Users, CalendarCheck, UserMinus, Clock, Loader2, AlertCircle, ArrowUpRight } from "lucide-react";
import { getDashboardStats, getRecentAttendance, getDeptDistribution } from "../services/dashboardService";

const colors = [
  "bg-pink-600", "bg-indigo-600", "bg-amber-600", "bg-blue-600", "bg-green-600", "bg-rose-600"
]

export default function Dashboard() {
  // Parallel Queries
  const { data: stats, isLoading: statsLoading } = useQuery({ 
    queryKey: ["dashboard-stats"], 
    queryFn: getDashboardStats 
  });
  
  const { data: recentAttendance, isLoading: attLoading } = useQuery({ 
    queryKey: ["recent-attendance"], 
    queryFn: getRecentAttendance 
  });

  const { data: deptStats, isLoading: deptLoading } = useQuery({ 
    queryKey: ["dept-distribution"], 
    queryFn: getDeptDistribution 
  });


  const isLoading = statsLoading || attLoading || deptLoading;

  if (isLoading) return (
    <div className="flex h-96 flex-col items-center justify-center text-slate-500">
      <Loader2 className="animate-spin mb-4 text-indigo-600" size={40} />
      <p className="animate-pulse">Aggregating real-time analytics...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">HR Analytics Overview</h1>
        <p className="text-slate-500">Welcome back. Here is your organization's health today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Employees" 
          value={stats?.totalEmployees || 0} 
          icon={<Users className="text-blue-600" />} 
          label="Active Staff" 
        />
        <StatsCard 
          title="Present Today" 
          value={stats?.presentToday || 0} 
          icon={<CalendarCheck className="text-green-600" />} 
          label={`${Math.round((stats?.presentToday / stats?.totalEmployees) * 100) || 0}% Rate`} 
        />
        <StatsCard 
          title="Absent Today" 
          value={stats?.onLeave || 0} 
          icon={<UserMinus className="text-orange-600" />} 
          label="Planned Absences" 
        />
        <StatsCard 
          title="Pending Records" 
          value={stats?.pending || 0} 
          icon={<Clock className="text-purple-600" />} 
          label="Review Required" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Attendance Table */}
        <section className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Recent Attendance</h3>
            <button className="text-xs text-indigo-600 font-bold hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
              View All Logs
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Check-in</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAttendance.recentAttendance?.map((log: any) => (
                  <TableRow 
                    key={log.id} 
                    name={log.employeeName} 
                    status={log.status} 
                    time={log.checkInTime || "--:--"} 
                    color={log.status === 'Present' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"} 
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Department Distribution */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Department Split</h3>
          <div className="space-y-6">
            {(deptStats.stats || [])?.map((dept: any, index: number) => (
              <DeptProgress 
                key={dept.name}
                label={dept.name} 
                percent={Math.round((dept.count / dept.total) * 100)} 
                color={colors[index % colors.length]}
              />
              
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* --- Components --- */

function StatsCard({ title, value, icon, label }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 bg-slate-50 rounded-xl">{icon}</div>
        <div className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
          <ArrowUpRight size={12} className="mr-1" />
          {label}
        </div>
      </div>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{title}</p>
      <h4 className="text-3xl font-black text-slate-900">{value}</h4>
    </div>
  );
}

function TableRow({ name, status, time, color }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-4 font-bold text-slate-700">{name}</td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${color}`}>{status}</span>
      </td>
      <td className="px-6 py-4 text-slate-500 font-medium">{time}</td>
    </tr>
  );
}

function DeptProgress({ label, percent, color }: any) {

  return (
    <div className="group">
      <div className="flex justify-between text-xs mb-2">
        <span className="text-slate-500 font-bold uppercase">{label}</span>
        <span className="font-black text-slate-900">{percent}%</span>
      </div>
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${color} transition-all duration-1000`} 
          style={{ width: `${percent}%` }} 
        />
      </div>
    </div>
  );
}