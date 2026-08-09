import axios from "axios";

// Base URL points at the Spring Boot backend. Override by creating a
// `.env` file (copy `.env.example`) with VITE_API_BASE_URL set.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const STORAGE_KEY = "primehub.session";

export function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeSession(session) {
  if (session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

const client = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.request.use((config) => {
  const session = readSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

// Central place to react to auth failures. The AuthContext registers a
// handler here so a 401 anywhere in the app forces a clean logout.
let onUnauthorized = null;
export function registerUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    return Promise.reject(normalizeError(error));
  }
);

export function normalizeError(error) {
  if (error?.response) {
    const data = error.response.data;
    let message;
    if (typeof data === "string") {
      message = data;
    } else if (data?.message) {
      message = data.message;
    } else if (data?.error) {
      message = data.error;
    } else {
      message = `Request failed (${error.response.status})`;
    }
    const err = new Error(message);
    err.status = error.response.status;
    return err;
  }
  if (error?.request) {
    return new Error("Could not reach the server. Check your connection or the API URL.");
  }
  return error instanceof Error ? error : new Error("Unexpected error.");
}

export default client;
