
"use client";

import type { Application } from "../data/application";

type AnalyticsProps = {
  applications: Application[];
};

export default function Analytics({ applications }: AnalyticsProps) {
  const total = applications.length;

  const applied = applications.filter(
    (app) => app.status === "Applied",
  ).length;

  const interview = applications.filter(
    (app) => app.status === "Interview",
  ).length;

  const success = applications.filter(
    (app) => app.status === "Success",
  ).length;

  const rejected = applications.filter(
    (app) => app.status === "Rejected",
  ).length;

  const interviewRate =
    total > 0 ? Math.round((interview / total) * 100) : 0;

  const successRate =
    total > 0 ? Math.round((success / total) * 100) : 0;

  const statusData = [
    { label: "Applied", count: applied, color: "bg-blue-500" },
    { label: "Interview", count: interview, color: "bg-amber-500" },
    { label: "Success", count: success, color: "bg-emerald-500" },
    { label: "Rejected", count: rejected, color: "bg-rose-500" },
  ];

  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));

    const year = date.getFullYear();
    const month = date.getMonth();

    const count = applications.filter((app) => {
      if (!app.appliedDate) return false;

      const appliedDate = new Date(`${app.appliedDate}T00:00:00`);

      return (
        !Number.isNaN(appliedDate.getTime()) &&
        appliedDate.getFullYear() === year &&
        appliedDate.getMonth() === month
      );
    }).length;

    return {
      label: date.toLocaleDateString("en-IN", { month: "short" }),
      count,
    };
  });

  const maxMonthlyCount = Math.max(
    1,
    ...monthlyData.map((item) => item.count),
  );

  const cards = [
    {
      label: "Total Applications",
      count: total,
      color: "text-violet-600",
      background: "bg-violet-50",
    },
    {
      label: "Applied",
      count: applied,
      color: "text-blue-600",
      background: "bg-blue-50",
    },
    {
      label: "Interviews",
      count: interview,
      color: "text-amber-600",
      background: "bg-amber-50",
    },
    {
      label: "Successful",
      count: success,
      color: "text-emerald-600",
      background: "bg-emerald-50",
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Job Search Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Understand your application progress and job search performance.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-500">
                {card.label}
              </p>
              <span
                className={`rounded-lg px-3 py-2 text-sm font-semibold ${card.background} ${card.color}`}
              >
                {card.label === "Total Applications" ? "Σ" : card.count}
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold text-slate-900">
              {card.count}
            </p>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Application Status
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            How your applications are distributed.
          </p>

          <div className="mt-6 space-y-5">
            {statusData.map((item) => {
              const percentage =
                total > 0 ? (item.count / total) * 100 : 0;

              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {item.label}
                    </span>
                    <span className="text-slate-500">
                      {item.count} ({Math.round(percentage)}%)
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly activity */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Monthly Activity
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Applications submitted over the last six calendar months.
          </p>

          <div className="mt-8 flex h-52 items-end justify-around gap-3 border-b border-slate-200 px-2">
            {monthlyData.map((item) => (
              <div
                key={item.label}
                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-xs font-medium text-slate-600">
                  {item.count}
                </span>

                <div
                  className="w-full max-w-12 rounded-t-md bg-violet-500"
                  style={{
                    height: `${Math.max(
                      item.count > 0 ? 8 : 0,
                      (item.count / maxMonthlyCount) * 140,
                    )}px`,
                  }}
                />

                <span className="mb-2 text-xs text-slate-500">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Interview Rate</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {interviewRate}%
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {interview} interview-stage applications out of {total} total.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Success Rate</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {successRate}%
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {success} successful applications out of {total} total.
          </p>
        </div>
      </div>
    </section>
  );
}
