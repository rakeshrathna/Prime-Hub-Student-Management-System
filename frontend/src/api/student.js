import client from "./client";

// GET /api/student/dashboard/{studentId}
export async function getDashboard(studentId) {
  const { data } = await client.get(`/api/student/dashboard/${studentId}`);
  return data;
}

// GET /api/student/{studentId}/tasks
export async function getStudentTasks(studentId) {
  const { data } = await client.get(`/api/student/${studentId}/tasks`);
  return data;
}

// GET /api/student/{studentId}/team
export async function getStudentTeam(studentId) {
  const { data } = await client.get(`/api/student/${studentId}/team`);
  return data;
}

// POST /api/student/submit/{assignmentId}  body: { content }
export async function submitWork(assignmentId, content) {
  const { data } = await client.post(`/api/student/submit/${assignmentId}`, { content });
  return data;
}

// PUT /api/student/profile/{studentId}  multipart/form-data: phoneNumber, password, file
export async function updateProfile(studentId, { phoneNumber, password, file }) {
  const form = new FormData();
  if (phoneNumber) form.append("phoneNumber", phoneNumber);
  if (password) form.append("password", password);
  if (file) form.append("file", file);

  const { data } = await client.put(`/api/student/profile/${studentId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
