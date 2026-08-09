import client from "./client";

// GET /api/tasks
export async function getAllTasks() {
  const { data } = await client.get("/api/tasks");
  return data;
}

// POST /api/tasks/create
export async function createTask(payload) {
  const { data } = await client.post("/api/tasks/create", payload);
  return data;
}

// POST /api/tasks/assign/students  body: { taskId, studentIds }
export async function assignToStudents(taskId, studentIds) {
  const { data } = await client.post("/api/tasks/assign/students", { taskId, studentIds });
  return data;
}

// POST /api/tasks/assign/team  body: { taskId, teamId }
export async function assignToTeam(taskId, teamId) {
  const { data } = await client.post("/api/tasks/assign/team", { taskId, teamId });
  return data;
}

// POST /api/tasks/submit/{assignmentId}
export async function submitAssignment(assignmentId) {
  const { data } = await client.post(`/api/tasks/submit/${assignmentId}`);
  return data;
}

// POST /api/tasks/grade  query params: teacherId, taskId, studentId, score, feedback
export async function gradeTask({ teacherId, taskId, studentId, score, feedback }) {
  const { data } = await client.post("/api/tasks/grade", null, {
    params: { teacherId, taskId, studentId, score, feedback },
  });
  return data;
}

// DELETE /api/tasks/{taskId}
export async function deleteTask(taskId) {
  const { data } = await client.delete(`/api/tasks/${taskId}`);
  return data;
}

// GET /api/tasks/teacher/{teacherId}/assignments
export async function getTeacherAssignments(teacherId) {
  const { data } = await client.get(`/api/tasks/teacher/${teacherId}/assignments`);
  return data;
}

// GET /api/tasks/teacher/{teacherId}
export async function getTasksByTeacher(teacherId) {
  const { data } = await client.get(`/api/tasks/teacher/${teacherId}`);
  return data;
}

// PATCH /api/tasks/assignments/{assignmentId}  body: { score }
export async function patchAssignmentScore(assignmentId, score) {
  const { data } = await client.patch(`/api/tasks/assignments/${assignmentId}`, { score });
  return data;
}
