export interface Application {
    id: number,
    company: string,
    role: string,
    location: string,
    status: string,
    appliedDate: string,
  }
export const applications = [
  {
    id: 1,
    company: "Google",
    role: "Frontend Developer",
    location: "Remote",
    status: "Applied",
    appliedDate: "2026-09-10",
  },
  {
    id: 2,
    company: "Zoho",
    role: "React Developer",
    location: "Chennai",
    status: "Interview",
    appliedDate: "2026-09-08",
  },
  {
    id: 3,
    company: "Freshworks",
    role: "UI Engineer",
    location: "Remote",
    status: "Rejected",
    appliedDate: "2026-09-05",
  },
];