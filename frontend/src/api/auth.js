import client from "./client";

// POST /api/auth/login -> { token, type, role, name, email, id, profileImageUrl }
export async function login(email, password) {
  const { data } = await client.post("/api/auth/login", { email, password });
  return data;
}
