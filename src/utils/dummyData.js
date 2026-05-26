export const SAMPLE_NOTIFICATIONS = [
  { id: 1, title: "Enrollment Open", msg: "Semester 2 enrollment is now open.", time: "2 min ago", unread: true },
  { id: 2, title: "Grade Released", msg: "Your IT101 grade has been posted.", time: "1 hr ago", unread: true },
  { id: 3, title: "Payment Reminder", msg: "Tuition balance due on May 1.", time: "3 hrs ago", unread: false },
  { id: 4, title: "System Maintenance", msg: "Portal will be down Saturday 2-4AM.", time: "1 day ago", unread: false },
];

export const SAMPLE_ANNOUNCEMENTS = [
  { id: 1, title: "Foundation Day Celebration", date: "April 20, 2026", body: "Join us for the annual Acez University Foundation Day! Activities include a parade, booth fair, and concert." },
  { id: 2, title: "Midterm Exam Schedule", date: "April 18, 2026", body: "Midterm examinations will be held from April 25 to May 2. Please check your individual schedules." },
  { id: 3, title: "Scholarship Applications", date: "April 10, 2026", body: "Applications for the Dean's List Scholarship are now open. Deadline: May 15, 2026." },
];

export const SAMPLE_GRADES = [
  { code: "IT101", desc: "Intro to Computing", units: 3, grade: "1.25", status: "Passed" },
  { code: "IT102", desc: "Programming 1", units: 3, grade: "1.50", status: "Passed" },
  { code: "MATH01", desc: "College Algebra", units: 3, grade: "2.00", status: "Passed" },
  { code: "ENG101", desc: "Purposive Communication", units: 3, grade: "1.75", status: "Passed" },
  { code: "PE001", desc: "Physical Fitness", units: 2, grade: "1.25", status: "Passed" },
  { code: "IT103", desc: "Data Structures", units: 3, grade: "---", status: "In Progress" },
];

export const SAMPLE_SCHEDULE = [
  { code: "IT103", desc: "Data Structures", day: "Mon/Wed", time: "8:00 - 9:30 AM", room: "Room 301" },
  { code: "IT104", desc: "Web Development", day: "Mon/Wed", time: "10:00 - 11:30 AM", room: "Lab 2" },
  { code: "MATH02", desc: "Discrete Math", day: "Tue/Thu", time: "8:00 - 9:30 AM", room: "Room 205" },
  { code: "ENG102", desc: "Technical Writing", day: "Tue/Thu", time: "1:00 - 2:30 PM", room: "Room 102" },
  { code: "PE002", desc: "Team Sports", day: "Fri", time: "7:00 - 9:00 AM", room: "Gym" },
];

export const SAMPLE_BALANCE = {
  tuition: 28500,
  misc: 4200,
  lab: 3500,
  total: 36200,
  paid: 18000,
  remaining: 18200,
  due: "May 1, 2026",
  payments: [
    { date: "Jan 15, 2026", amount: 10000, method: "Cash", ref: "PAY-20260115-001" },
    { date: "Feb 20, 2026", amount: 8000, method: "GCash", ref: "PAY-20260220-002" },
  ],
};

export const SAMPLE_MEDICAL = {
  bloodType: "O+",
  allergies: "None",
  conditions: "None",
  emergencyContact: "Maria Dela Cruz — 0917-123-4567",
  vaccinations: [
    { name: "COVID-19 (Pfizer)", date: "March 2025", status: "Complete" },
    { name: "Hepatitis B", date: "June 2024", status: "Complete" },
    { name: "Flu Vaccine", date: "October 2025", status: "Complete" },
  ],
  checkups: [
    { date: "Aug 10, 2025", findings: "Fit for enrollment. No issues found." },
    { date: "Jan 8, 2026", findings: "Mild astigmatism noted. Referred to ophthalmologist." },
  ],
};
