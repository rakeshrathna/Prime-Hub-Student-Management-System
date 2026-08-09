import client from "./client";

// GET /api/admin/users
export async function getAllUsers() {
  const { data } = await client.get("/api/admin/users");
  return data;
}

// POST /api/admin/users
export async function createUser(user) {
  const { data } = await client.post("/api/admin/users", user);
  return data;
}

// PUT /api/admin/users/{id}
export async function updateUser(id, user) {
  const { data } = await client.put(`/api/admin/users/${id}`, user);
  return data;
}

// DELETE /api/admin/users/{id}
export async function deleteUser(id) {
  const { data } = await client.delete(`/api/admin/users/${id}`);
  return data;
}
