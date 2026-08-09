import client from "./client";

// ---- Announcements ----

// POST /api/school/announcements  body: { teacherId, title, content }
export async function postAnnouncement({ postedById, title, content }) {
  const { data } = await client.post("/api/school/announcements", {
    teacherId: postedById,
    title,
    content,
  });
  return data;
}

// GET /api/school/announcements
export async function getAnnouncements() {
  const { data } = await client.get("/api/school/announcements");
  return data;
}

// ---- Leave ----

// POST /api/school/leave/apply  body: { studentId, reason, startDate, endDate }
export async function applyForLeave({ studentId, reason, startDate, endDate }) {
  const { data } = await client.post("/api/school/leave/apply", {
    studentId,
    reason,
    startDate,
    endDate,
  });
  return data;
}

// GET /api/school/leave/pending
export async function getPendingLeaves() {
  const { data } = await client.get("/api/school/leave/pending");
  return data;
}

// GET /api/school/leave/history/{studentId}
export async function getStudentLeaveHistory(studentId) {
  const { data } = await client.get(`/api/school/leave/history/${studentId}`);
  return data;
}

// PATCH /api/school/leave/status/{leaveId}  body: { status: "APPROVED" | "REJECTED" }
export async function updateLeaveStatus(leaveId, status) {
  const { data } = await client.patch(`/api/school/leave/status/${leaveId}`, { status });
  return data;
}

// ---- Notes ----

// POST /api/school/notes  body: { teacherId, studentId, content }
export async function addNote({ teacherId, studentId, content }) {
  const { data } = await client.post("/api/school/notes", { teacherId, studentId, content });
  return data;
}

// GET /api/school/notes?teacherId=&studentId=
export async function getNotes({ teacherId, studentId }) {
  const { data } = await client.get("/api/school/notes", {
    params: teacherId ? { teacherId, studentId } : { studentId },
  });
  return data;
}
