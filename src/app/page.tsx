"use client";
import { useState, useEffect } from "react";
import { ApplicationCard } from "../components/ApplicationCard";
import { Application } from "../data/application";
import Analytics from "../components/Analytics";

type ApiApplication = {
  id: number;
  company: string;
  role: string;
  location: string;
  status: string;
  applied_date: string;
};

export default function Home() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [edit, setEdit] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    status: "Applied",
  });
  const [applicationsList, setApplicationsList] = useState<Application[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  let displayedApplications;
  const totalApplications = applicationsList.length;
  const appliedApplications = applicationsList.filter(
    (application) => application.status === "Applied",
  ).length;
  const interviewApplications = applicationsList.filter(
    (application) => application.status === "Interview",
  ).length;
  const successApplications = applicationsList.filter(
    (application) => application.status === "Success",
  ).length;
  const rejectedApplications = applicationsList.filter(
    (application) => application.status === "Rejected",
  ).length;
  const [sortBy, setSortBy] = useState<keyof Application>("company");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [activeTab, setActiveTab] = useState<"overview" | "analytics">(
    "overview",
  );

  useEffect(() => {
    async function fetchApplication() {
      const response = await fetch("/api/applications");
      const data = await response.json();
      const normalizedApplication = data.data.applications.map(
        (application: ApiApplication) => {
          return {
            ...application,
            appliedDate: application.applied_date,
          };
        },
      );
      setApplicationsList(normalizedApplication);
    }
    fetchApplication();
  }, []);

  if (selectedStatus === "All") {
    displayedApplications = applicationsList;
  } else {
    displayedApplications = applicationsList.filter(
      (application) => application.status === selectedStatus,
    );
  }
  displayedApplications = displayedApplications.filter((application) =>
    [application.company, application.role, application.location].some(
      (field) => field.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  displayedApplications = [...displayedApplications].sort((a, b) => {
    const firstValue = String(a[sortBy]);
    const secondValue = String(b[sortBy]);

    const result = firstValue.localeCompare(secondValue, undefined, {
      numeric: true,
      sensitivity: "base",
    });

    return sortDirection === "asc" ? result : -result;
  });

  async function handleAddApplication() {
    if (
      formData.company === "" ||
      formData.role === "" ||
      formData.location === ""
    ) {
      alert("Please fill the empty fields");
      return;
    }

    if (edit !== null) {
      // const updatedApplication = applicationsList.map((application) => {
      //   if (application.id === edit.id) {
      //     return { ...application, ...formData };
      //   } else {
      //     return application;
      //   }
      // });
      const response = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: edit.id, ...formData }),
      });
      const data = await response.json();
      if (!response.ok || data.errors) {
        alert("Failed to Update Application");
        return;
      }
      const savedApplication = data.data.update_applications_by_pk;
      const normalizedApplication = {
        ...savedApplication,
        appliedDate: savedApplication.applied_date,
      };
      setApplicationsList(
        applicationsList.map((application) =>
          application.id === savedApplication.id
            ? normalizedApplication
            : application,
        ),
      );
      setEdit(null);
      setFormData({ company: "", role: "", location: "", status: "Applied" });
      setIsFormOpen(false);
      alert("Application updated successfully!");
      return;
    }

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok || data.errors) {
      alert("Failed to Add Application");
      return;
    }
    const savedApplication = data.data.insert_applications_one;
    const normalizedApplication = {
      ...savedApplication,
      appliedDate: savedApplication.applied_date,
    };
    setApplicationsList([normalizedApplication, ...applicationsList]);
    // const currentDate = new Date();
    // const appliedDate = currentDate.toISOString().split("T")[0];
    // // const newApplication = { id: newId, ...formData, appliedDate };
    // setApplicationsList([...applicationsList, newApplication]);
    setFormData({ company: "", role: "", location: "", status: "Applied" });
    setIsFormOpen(false);
    alert("Application added successfully!");
  }

  function handleEdit(application: Application) {
    setEdit(application);
    setFormData({
      company: application.company,
      role: application.role,
      location: application.location,
      status: application.status,
    });
    setIsFormOpen(true);
  }

  async function handleDelete(application: Application) {
    const response = await fetch("/api/applications", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: application.id }),
    });

    const data = await response.json();

    if (!response.ok || data.errors || !data.data.delete_applications_by_pk) {
      alert("Failed to delete application");
      return;
    }

    const updatedApplications = applicationsList.filter((data) => {
      if (data.id !== application.id) {
        return data;
      } else {
        return false;
      }
    });
    setApplicationsList(updatedApplications);
    alert("Application deleted!");
  }

  return (
    <div className="flex min-h-screen bg-[#F1F5F9] font-sans antialiased text-slate-700">
      {/* Sidebar (TailAdmin Dark Navy Navigation) */}
      <aside className="w-64 bg-[#1C2434] text-slate-300 hidden lg:flex flex-col justify-between shrink-0">
        <div>
          <div className="px-6 py-6 border-b border-slate-700/50 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
              JT
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              JobTrack
            </span>
          </div>

          <div className="px-4 py-6">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Analytics Menu
            </p>
            <nav className="space-y-1">
              <a
                href="#"
              >
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition ${
                    activeTab === "overview"
                      ? "bg-indigo-600/15 text-indigo-400"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                  Overview
                </button>
              </a>
              <a
                href="#"
              >
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition ${
                    activeTab === "analytics"
                      ? "bg-indigo-600/15 text-indigo-400"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10"
                    />
                  </svg>
                  Analytics
                </button>
              </a>
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-700 text-white font-semibold flex items-center justify-center text-xs">
              AD
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">Jayasree</p>
              <p className="text-xs text-slate-400">jayasree@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeTab === "analytics" ? (
          <Analytics applications={applicationsList} />
        ) : (
          <>
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Job Application Dashboard
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Track your applications, interviews and job search progress.
                </p>
              </div>
              <button
                onClick={() => {
                  setEdit(null);
                  setFormData({
                    company: "",
                    role: "",
                    location: "",
                    status: "Applied",
                  });
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition active:scale-95"
              >
                + Add Application
              </button>
            </div>

            {/* Metrics Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
              <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total Apps
                  </span>
                  <span className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                    ∑
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-2">
                  {totalApplications}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  All job applications you're tracking
                </div>
                {/* <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: "100%" }} />
            </div> */}
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Applied
                  </span>
                  <span className="h-8 w-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-2">
                  {appliedApplications}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Applications you've submitted
                </div>
                {/* <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-yellow-500 h-1.5 rounded-full"
                style={{ width: `${totalApplications ? (appliedApplications / totalApplications) * 100 : 0}%` }}
              />
            </div> */}
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Interview
                  </span>
                  <span className="h-8 w-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center text-xs font-bold">
                    ⚡
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-2">
                  {interviewApplications}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Applications currently in scheduled
                </div>
                {/* <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-yellow-500 h-1.5 rounded-full"
                style={{ width: `${totalApplications ? (interviewApplications / totalApplications) * 100 : 0}%` }}
              />
            </div> */}
              </div>
              <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    success
                  </span>
                  <span className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-2">
                  {successApplications}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Successful applications that have been accepted
                </div>
                {/* <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-1.5 rounded-full"
                style={{ width: `${totalApplications ? (successApplications / totalApplications) * 100 : 0}%` }}
              />
            </div> */}
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Rejected
                  </span>
                  <span className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold">
                    ✕
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-2">
                  {rejectedApplications}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Applications that has been rejected
                </div>
                {/* <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-rose-500 h-1.5 rounded-full"
                style={{ width: `${totalApplications ? (rejected / totalApplications) * 100 : 0}%` }}
              />
            </div> */}
              </div>
            </div>

            {/* Filters and Search Bar */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="w-full sm:w-80 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search company, role, location..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
                <svg
                  className="w-4 h-4 text-slate-400 absolute left-3 top-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  FILTER BY:
                </label>
                <select
                  value={selectedStatus}
                  onChange={(event) => setSelectedStatus(event.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                >
                  <option value="All">All Applications</option>
                  <option value="Interview">Interview</option>
                  <option value="Applied">Applied</option>
                  <option value="Success">Success</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Modal Form */}
            {isFormOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-xl p-6 relative">
                  <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">
                      {edit ? "Edit Application" : "New Application"}
                    </h3>
                    <button
                      onClick={() => setIsFormOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                        Company
                      </label>
                      <input
                        value={formData.company}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            company: event.target.value,
                          })
                        }
                        placeholder="e.g. Acme Corp"
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                        Role
                      </label>
                      <input
                        value={formData.role}
                        onChange={(event) =>
                          setFormData({ ...formData, role: event.target.value })
                        }
                        placeholder="e.g. Frontend Engineer"
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                        Location
                      </label>
                      <input
                        value={formData.location}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            location: event.target.value,
                          })
                        }
                        placeholder="e.g. Remote / New York, NY"
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            status: event.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      >
                        <option value="Interview">Interview</option>
                        <option value="Applied">Applied</option>
                        <option value="Success">Success</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddApplication}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Application Table Card */}
            <div className="text-sm font-semibold mb-2 uppercase tracking-wider text-slate-800">
              Recent Applications
            </div>
            <div className="text-xs mb-6 tracking-wider text-slate-500">
              Your latest job applications and their current status.
            </div>
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="hidden md:grid md:grid-cols-6 gap-4 px-6 py-3.5 bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <button
                  type="button"
                  className="md:col-span-2 text-left"
                  onClick={() => {
                    setSortDirection(
                      sortBy === "company"
                        ? sortDirection === "asc"
                          ? "desc"
                          : "asc"
                        : "asc",
                    );
                    setSortBy("company");
                  }}
                >
                  Company & Role{" "}
                  {sortBy === "company"
                    ? sortDirection === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </button>

                <button
                  type="button"
                  className="text-left"
                  onClick={() => {
                    setSortDirection(
                      sortBy === "location"
                        ? sortDirection === "asc"
                          ? "desc"
                          : "asc"
                        : "asc",
                    );
                    setSortBy("location");
                  }}
                >
                  Location{" "}
                  {sortBy === "location"
                    ? sortDirection === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </button>

                <button
                  type="button"
                  className="text-left"
                  onClick={() => {
                    setSortDirection(
                      sortBy === "status"
                        ? sortDirection === "asc"
                          ? "desc"
                          : "asc"
                        : "asc",
                    );
                    setSortBy("status");
                  }}
                >
                  Status{" "}
                  {sortBy === "status"
                    ? sortDirection === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </button>

                <button
                  type="button"
                  className="text-left"
                  onClick={() => {
                    setSortDirection(
                      sortBy === "appliedDate"
                        ? sortDirection === "asc"
                          ? "desc"
                          : "asc"
                        : "asc",
                    );
                    setSortBy("appliedDate");
                  }}
                >
                  Applied Date{" "}
                  {sortBy === "appliedDate"
                    ? sortDirection === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </button>

                <span className="text-right">Actions</span>
              </div>

              <div className="divide-y divide-slate-100">
                {displayedApplications.length > 0 ? (
                  displayedApplications.map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-400 text-sm font-medium">
                    No applications match your criteria.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
