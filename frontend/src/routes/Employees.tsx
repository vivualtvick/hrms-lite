import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Filter, Trash2, X, Loader2, AlertCircle, UserPlus, Users, Calendar, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { getEmployees, createEmployee, deleteEmployee } from "../services/employeeService";
import Modal from "../components/modal";
import { getDepartments } from "../services/departmentService";
import { useNavigate } from 'react-router-dom';

export default function Employees() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // --- UI STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [empToDelete, setEmpToDelete] = useState<{ id: string; name: string } | null>(null);
  
  // NEW: Date Filter State
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Add Employee Form State
  const [formData, setFormData] = useState({ name: "", email: "", dept: "" });

  // --- API DATA FETCHING ---
  // Added selectedDate to the queryKey so it auto-refetches when the date changes
  const { data: employees, isLoading, isError, error } = useQuery({
    queryKey: ["employees", selectedDate], 
    queryFn: () => getEmployees(selectedDate),
  });

  const { data: departments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const employeeList = useMemo(() => (Array.isArray(employees?.employees) ? employees?.employees : []), [employees?.employees]);

  // --- FILTER LOGIC (Client-side Search & Dept) ---
  const filteredEmployees = useMemo(() => {
    return employeeList.filter((emp: any) => {
      const matchesSearch = 
        emp.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department__name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDept === "All" || emp.department__name === selectedDept;
      return matchesSearch && matchesDept;
    });
  }, [searchTerm, selectedDept, employeeList]);

  // --- MUTATIONS ---
  const addMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setIsModalOpen(false);
      setFormData({ name: "", email: "", dept: "" });
      toast.success("Employee added successfully");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to add employee"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setEmpToDelete(null);
      toast.success("Employee removed");
    },
    onError: () => toast.error("Error deleting employee"),
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.dept) {
      return toast.error("Please fill all fields");
    }
    addMutation.mutate(formData);
  };

  // NEW: Handle Date Reset
  const clearDateFilter = () => {
    setSelectedDate("");
  };

  if (isLoading) return (
    <div className="flex h-96 flex-col items-center justify-center text-slate-500">
      <Loader2 className="animate-spin mb-4 text-indigo-600" size={40} />
      <p className="font-medium">Loading workforce data...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header (Stayed Same) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-500 text-sm">Manage and monitor your team members.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-100 active:scale-95 transition-all"
        >
          <UserPlus size={18} />
          Add Employee
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or ID..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Departments</option>
              {departments?.departments?.map((dept: any) => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
            <button 
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all ${showMoreFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Filter size={16} />
              {showMoreFilters ? 'Hide Filters' : 'More Filters'}
            </button>
          </div>
        </div>

        {/* --- MORE FILTERS SECTION --- */}
        {showMoreFilters && (
          <div className="px-4 pb-4 pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 bg-slate-50/50 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Calendar size={12}/> Join Date Filter
                </label>
                {selectedDate && (
                  <button onClick={clearDateFilter} className="text-[10px] text-indigo-600 font-bold hover:underline">Clear</button>
                )}
              </div>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500" 
              />
            </div>
          </div>
        )}
      </div>

      {/* --- ADD EMPLOYEE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Add New Employee</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <FormInput 
                label="Full Name" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={(e: any) => setFormData({...formData, name: e.target.value})}
                required
              />
              <FormInput 
                label="Email Address" 
                type="email" 
                placeholder="john@company.com" 
                value={formData.email}
                onChange={(e: any) => setFormData({...formData, email: e.target.value})}
                required
              />
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Department
                </label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm"
                  value={formData.dept}
                  onChange={(e) => setFormData({...formData, dept: e.target.value})}
                  required
                >
                  <option value="" disabled>Select Department</option>
                  {/* DYNAMIC INTEGRATION: Mapping your actual departments here */}
                  {departments?.departments?.map((dept: any) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
                
              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={addMutation.isPending}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  {addMutation.isPending && <Loader2 size={16} className="animate-spin" />}
                  {addMutation.isPending ? "Creating Profile..." : "Confirm Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table & Modals (Stayed Same) */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Employee ID</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Name</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Email</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Department</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp: any) => (
                <tr key={emp.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-indigo-600 font-mono">{emp.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{emp.full_name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{emp.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600">
                      {emp.department__name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button  
                      onClick={() => navigate(`/employees/${emp.id}`)}
                      className="p-2 mr-2 text-blue-500 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => setEmpToDelete({ id: emp.id, name: emp.full_name })}
                      className="p-2 text-red-500 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredEmployees.length === 0 && (
            <div className="py-20 text-center">
              <Users className="mx-auto text-slate-200 mb-2" size={48} />
              <p className="text-slate-500 font-medium">No results found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal and Delete Modal Logic stays as you had it */}
      <Modal 
        isOpen={!!empToDelete} 
        onClose={() => setEmpToDelete(null)} 
        onConfirm={() => empToDelete && deleteMutation.mutate(empToDelete.id)}
        type="destructive"
        title="Delete Employee"
        description={`Are you sure you want to delete ${empToDelete?.name}? This action is permanent.`}
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
      />
    </div>
  );
}


function FormInput({ label, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      <input 
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm transition-all"
        {...props}
      />
    </div>
  );
}