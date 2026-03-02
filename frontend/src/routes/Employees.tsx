import { useState } from "react";
import { Plus, Search, Filter, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

const MOCK_EMPLOYEES = [
  { id: "EMP001", name: "Alice Johnson", email: "alice@company.com", dept: "Engineering" },
  { id: "EMP002", name: "Bob Smith", email: "bob@company.com", dept: "Marketing" },
  { id: "EMP003", name: "Charlie Davis", email: "charlie@company.com", dept: "Design" },
];

export default function Employees() {
  // State for List Logic
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for Add Employee Form
  const [formData, setFormData] = useState({ id: "", name: "", email: "", dept: "Engineering" });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Validation (Matches assignment requirements)
    if (!formData.id || !formData.name || !formData.email) {
      return toast.error("All fields are required");
    }
    if (employees.some(emp => emp.id === formData.id)) {
      return toast.error("Employee ID must be unique");
    }

    setEmployees([formData, ...employees]);
    setIsModalOpen(false);
    setFormData({ id: "", name: "", email: "", dept: "Engineering" });
    toast.success("Employee added successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-500">Manage your workforce and their roles.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-2.5 outline-none">
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
            </select>
            <button 
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all ${showMoreFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Filter size={16} />
              {showMoreFilters ? 'Hide Filters' : 'More Filters'}
            </button>
          </div>
        </div>

        {/* More Filters Section (Conditional) */}
        {showMoreFilters && (
          <div className="px-4 pb-4 pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 bg-slate-50/50 animate-in fade-in slide-in-from-top-2">
            <FilterInput label="Joined Date" type="date" />
            <FilterInput label="Status" type="select" options={["Active", "Inactive", "On Leave"]} />
            <FilterInput label="Employee Type" type="select" options={["Full-time", "Contract", "Intern"]} />
          </div>
        )}
      </div>

      {/* Table Section (Using existing table structure) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            {/* ... table headers ... */}
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-sm font-medium text-indigo-600">{emp.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">{emp.name}</p>
                    <p className="text-xs text-slate-500">{emp.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{emp.dept}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setEmployees(employees.filter(e => e.id !== emp.id))} className="p-2 text-slate-400 hover:text-red-600 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD EMPLOYEE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Add New Employee</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
              <FormInput 
                label="Employee ID" 
                placeholder="EMP123" 
                value={formData.id}
                onChange={(e) => setFormData({...formData, id: e.target.value})}
              />
              <FormInput 
                label="Full Name" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <FormInput 
                label="Email Address" 
                type="email" 
                placeholder="john@company.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Department</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm"
                  value={formData.dept}
                  onChange={(e) => setFormData({...formData, dept: e.target.value})}
                >
                  <option>Engineering</option>
                  <option>Marketing</option>
                  <option>Design</option>
                  <option>HR</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components for Cleaner Code
function FilterInput({ label, type, options }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      {type === "select" ? (
        <select className="w-full p-2 bg-white border border-slate-200 rounded text-xs outline-none focus:border-indigo-500">
          {options.map((opt: string) => <option key={opt}>{opt}</option>)}
        </select>
      ) : (
        <input type={type} className="w-full p-2 bg-white border border-slate-200 rounded text-xs outline-none focus:border-indigo-500" />
      )}
    </div>
  );
}

function FormInput({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
      <input 
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm transition-all"
        {...props}
      />
    </div>
  );
}