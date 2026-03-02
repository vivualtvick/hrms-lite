import { useState } from "react";
import { Calendar, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Save, Search } from "lucide-react";

const MOCK_ATTENDANCE = [
  { id: "EMP001", name: "Alice Johnson", dept: "Engineering", status: "Present" },
  { id: "EMP002", name: "Bob Smith", dept: "Marketing", status: "Absent" },
  { id: "EMP003", name: "Charlie Davis", dept: "Design", status: "Present" },
  { id: "EMP004", name: "Diana Prince", dept: "Engineering", status: "Present" },
];

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Daily Attendance</h1>
          <p className="text-slate-500">Mark and review employee presence for the day.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      {/* Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Date Picker */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm font-medium text-slate-700"
          />
        </div>

        {/* Quick Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Quick find employee..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm"
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Employee</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Department</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 text-center">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_ATTENDANCE.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{emp.name}</p>
                        <p className="text-xs text-slate-500">{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{emp.dept}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <StatusToggle active={emp.status === 'Present'} label="Present" />
                      <StatusToggle active={emp.status === 'Absent'} label="Absent" variant="danger" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-medium text-indigo-600 hover:underline">History</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* --- Sub-component for Toggle Buttons --- */

function StatusToggle({ active, label, variant = "success" }: any) {
  const styles = {
    success: active ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50",
    danger: active ? "bg-red-100 text-red-700 border-red-200" : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50"
  };

  return (
    <button className={`px-3 py-1.5 rounded-md border text-xs font-bold transition-all ${variant === 'success' ? styles.success : styles.danger}`}>
      {label}
    </button>
  );
}