import { X, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description: string;
  type?: "destructive" | "info" | "success";
  confirmText?: string;
  cancelText?: string;
};

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = "info",
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ModalProps) {
  if (!isOpen) return null;

  const themes = {
    destructive: {
      icon: <AlertTriangle className="text-red-600" size={24} />,
      bg: "bg-red-50",
      button: "bg-red-600 hover:bg-red-700 shadow-red-100",
    },
    info: {
      icon: <Info className="text-blue-600" size={24} />,
      bg: "bg-blue-50",
      button: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100",
    },
    success: {
      icon: <CheckCircle2 className="text-emerald-600" size={24} />,
      bg: "bg-emerald-50",
      button: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100",
    },
  };

  const theme = themes[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all border border-slate-100">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 p-3 rounded-xl ${theme.bg}`}>
            {theme.icon}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 leading-6">
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {description}
            </p>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
          >
            {cancelText}
          </button>
          
          {onConfirm && (
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all shadow-lg ${theme.button}`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}