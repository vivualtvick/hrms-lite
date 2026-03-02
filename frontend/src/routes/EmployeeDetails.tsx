import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, Mail, Building2, Calendar, 
  User, Clock, CheckCircle2, XCircle, Loader2 
} from "lucide-react";
import { getEmployeeById, getEmployeeAttendance, updateAttendanceStatus } from "../services/EmployeeDetailService";
import toast from "react-hot-toast";

export default function EmployeeDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  // --- API DATA FETCHING ---
  const { data: employee, isLoading: empLoading, isError: empError } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => getEmployeeById(id!),
    enabled: !!id,
  });

  const { data: attendance, isLoading: attLoading } = useQuery({
    queryKey: ["attendance", id],
    queryFn: () => getEmployeeAttendance(id!),
    enabled: !!id,
  });

  // --- UPDATE MUTATION ---
  const updateMutation = useMutation({
    mutationFn: ({ logId, newStatus }: { logId: string; newStatus: string }) => 
      updateAttendanceStatus(logId, newStatus),
    onSuccess: () => {
      // Invalidate the cache to trigger a re-fetch of the attendance list
      queryClient.invalidateQueries({ queryKey: ["attendance", id] });
      toast.success("Attendance status updated");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
  });

  if (empLoading || attLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (empError || !employee) {
    return (
      <div className="p-12 text-center bg-red-50 rounded-2xl">
        <p className="text-red-600 font-bold">Employee not found or server error.</p>
        <Link to="/employees" className="text-indigo-600 underline mt-2 inline-block">Return to directory</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Link to="/employees" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium w-fit">
        <ArrowLeft size={16} /> Back to Directory
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600">
                {employee.name?.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{employee.employee?.full_name}</h1>
                <p className="text-sm text-slate-500 font-medium">{employee.employee?.department} Department</p>
                <span className="mt-2 inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-full">
                  Active Staff
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-5 pt-6 border-t border-slate-50">
              <InfoRow icon={<User size={16}/>} label="Employee ID" value={employee.employee?.id} />
              <InfoRow icon={<Mail size={16}/>} label="Email Address" value={employee.employee?.email} />
              <InfoRow icon={<Building2 size={16}/>} label="Department" value={employee.employee?.department} />
              <InfoRow icon={<Calendar size={16}/>} label="Joined Date" value={employee.employee?.join_date ? new Date(employee.employee.join_date).toLocaleDateString() : ''} />
            </div>
          </div>
        </div>
        {/* Right Column: Attendance History */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Clock size={18} className="text-indigo-600" /> Attendance History
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Check-in</th>
                    <th className="px-6 py-4 text-right">Quick Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(attendance.attendance_records || [] )?.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-slate-700">{log.date}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={log.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{log.checkIn || "--:--"}</td>
                      <td className="px-6 py-4 text-right">
                        <select 
                          className="text-[10px] font-bold uppercase bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                          value={log.status}
                          disabled={updateMutation.isPending}
                          onChange={(e) => updateMutation.mutate({ logId: log.id, newStatus: e.target.value })}
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="On Leave">On Leave</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {(!attendance || attendance.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400">No logs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Sub-components --- */

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-slate-50 rounded-lg text-slate-400">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-700">{value || "---"}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isPresent = status.toLowerCase() === "present";
  const isLeave = status.toLowerCase() === "on leave";

  let styles = "bg-red-50 text-red-600";
  let Icon = XCircle;

  if (isPresent) {
    styles = "bg-emerald-50 text-emerald-600";
    Icon = CheckCircle2;
  } else if (isLeave) {
    styles = "bg-amber-50 text-amber-600";
    Icon = Clock;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${styles}`}>
      <Icon size={12}/>
      {status}
    </span>
  );
}