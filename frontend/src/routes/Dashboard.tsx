import { Users, CalendarCheck, UserMinus, Clock } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">HR Analytics Overview</h1>
        <p className="text-slate-500">Welcome back, Admin. Here is what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Employees" value="124" icon={<Users className="text-blue-600" />} change="+3 this month" />
        <StatsCard title="Present Today" value="110" icon={<CalendarCheck className="text-green-600" />} change="88% Attendance" />
        <StatsCard title="On Leave" value="12" icon={<UserMinus className="text-orange-600" />} change="Planned" />
        <StatsCard title="Pending Records" value="2" icon={<Clock className="text-purple-600" />} change="Action required" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Attendance Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Recent Attendance</h3>
            <button className="text-sm text-indigo-600 font-medium hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 font-medium">Employee</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <TableRow name="John Doe" status="Present" time="09:00 AM" color="bg-green-100 text-green-700" />
                <TableRow name="Jane Smith" status="Present" time="08:45 AM" color="bg-green-100 text-green-700" />
                <TableRow name="Robert Brown" status="Absent" time="-" color="bg-red-100 text-red-700" />
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Department Split</h3>
          <div className="space-y-4">
            <DeptProgress label="Engineering" percent={65} color="bg-indigo-500" />
            <DeptProgress label="Design" percent={20} color="bg-pink-500" />
            <DeptProgress label="Marketing" percent={15} color="bg-amber-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Sub-components for Cleanliness --- */

function StatsCard({ title, value, icon, change }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{change}</span>
      </div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
    </div>
  );
}

function TableRow({ name, status, time, color }: any) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 font-medium text-slate-900">{name}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-md text-xs font-bold ${color}`}>{status}</span>
      </td>
      <td className="px-6 py-4 text-slate-500">{time}</td>
    </tr>
  );
}

function DeptProgress({ label, percent, color }: any) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold">{percent}%</span>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}