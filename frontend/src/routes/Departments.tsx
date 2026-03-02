import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Plus, Trash2, Users, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { getDepartments, createDepartment, deleteDepartment } from "../services/departmentService";
import Modal from "../components/modal";

export default function Departments() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deptToDelete, setDeptToDelete] = useState<{ id: number; name: string } | null>(null);

  // --- FETCH DEPARTMENTS ---
  const { data: departments, isLoading, isError, error } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  console.log(departments, isError, isLoading, error, "---------------");
  // --- CREATE MUTATION ---
  const addMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      setName("");
      setDescription("");
      toast.success("Department created successfully!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create department");
    },
  });

  // --- DELETE MUTATION ---
  const deleteMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department removed");
      setDeptToDelete(null);
    },
    onError: () => toast.error("Error deleting department"),
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return toast.error("Please fill in all fields");
    addMutation.mutate({ name, description });
  };

  // --- UI STATES ---
  if (isLoading) return (
    <div className="flex h-64 flex-col items-center justify-center text-slate-500">
      <Loader2 className="animate-spin mb-2" size={32} />
      <p>Loading departments...</p>
    </div>
  );

  if (isError) return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-xl border border-red-100 text-red-600">
      <AlertCircle size={32} className="mb-2" />
      <p className="font-bold">Failed to load data</p>
      <p className="text-sm">{(error as any).message}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
        <p className="text-slate-500">Organize your company structure.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleAddSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Plus size={20} className="text-indigo-600" /> Add New Dept
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Engineering"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this team do?"
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
              />
              <button
                type="submit"
                disabled={addMutation.isPending}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50 transition-all shadow-md shadow-indigo-100"
              >
                {addMutation.isPending ? "Creating..." : "Create Department"}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {(departments.departments || []).map((dept: any) => (
            <div key={dept.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all group">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Building2 size={24} /></div>
                <button
                  onClick={() => setDeptToDelete({ id: dept.id, name: dept.name })}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">{dept.name}</h4>
              <p className="text-sm text-slate-500 line-clamp-2 h-10">{dept.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-4">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Users size={16} />
                  <span className="text-xs font-medium">{dept.employeeCount || 0} Employees</span>
                </div>
              </div>
            </div>
          ))}

          {(departments.departments || []).length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500">No departments found.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- REUSABLE DELETE MODAL --- */}
      <Modal
        isOpen={!!deptToDelete}
        onClose={() => setDeptToDelete(null)}
        onConfirm={() => deptToDelete && deleteMutation.mutate(deptToDelete.id)}
        type="destructive"
        title="Delete Department"
        description={`Are you sure you want to delete ${deptToDelete?.name}? This action cannot be undone.`}
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
      />
    </div>
  );
}