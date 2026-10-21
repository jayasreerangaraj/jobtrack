import { Application } from "../data/application";

type ApplicationCardProps = {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
};

export function ApplicationCard(props: ApplicationCardProps) {
  const { application, onEdit, onDelete } = props;

  const statusColors: Record<string, string> = {
    Interview: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200/50",
    Applied: "bg-yellow-50 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400 border border-yellow-200/50",
    Success: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50",
    Rejected: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/50",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 items-center gap-4 px-6 py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70 transition duration-150 ease-in-out text-sm">
      <div className="md:col-span-2">
        <p className="font-semibold text-slate-800 tracking-tight">{application.company}</p>
        <p className="text-xs text-slate-500 font-medium">{application.role}</p>
      </div>

      <div className="text-slate-600 flex items-center text-xs font-medium">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span>
        {application.location}
      </div>

      <div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            statusColors[application.status] || "bg-slate-100 text-slate-700"
          }`}
        >
          {application.status}
        </span>
      </div>

      <div className="text-xs text-slate-500 font-medium">
        {application.appliedDate || "N/A"}
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit(application)}
          className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg shadow-sm transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(application)}
          className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-white bg-white hover:bg-rose-600 border border-rose-200 hover:border-transparent rounded-lg shadow-sm transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}