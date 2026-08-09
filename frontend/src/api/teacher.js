import client from "./client";

// GET /api/teacher/students
export async function getAllStudents() {
  const { data } = await client.get("/api/teacher/students");
  return data;
}

// GET /api/teacher/{teacherId}/teams
export async function getTeacherTeams(teacherId) {
  const { data } = await client.get(`/api/teacher/${teacherId}/teams`);
  return data;
}

// POST /api/teacher/{teacherId}/teams/create  body: { name, studentIds }
export async function createTeam(teacherId, name, studentIds) {
  const { data } = await client.post(`/api/teacher/${teacherId}/teams/create`, {
    name,
    studentIds,
  });
  return data;
}
