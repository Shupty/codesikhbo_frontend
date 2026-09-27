import axios from "axios";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;
if (process.env.NODE_ENV === "production" && !configuredApiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL must be set to the deployed LMS API URL before building for production.");
}
if (process.env.NODE_ENV === "production" && new URL(configuredApiUrl).protocol !== "https:") {
  throw new Error("NEXT_PUBLIC_API_URL must use HTTPS in production.");
}

export const API_URL = (configuredApiUrl || "http://localhost:4100/api").replace(/\/$/, "");

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export async function request(path, options = {}, token) {
  try {
    const response = await api.request({
      url: path,
      method: options.method || "GET",
      data: options.body ? JSON.parse(options.body) : undefined,
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return response.data;
  } catch (error) {
    if (!error.response) throw new Error("Unable to reach the API. Check that the backend is running.");
    const apiError = new Error(error.response.data?.error || `Request failed (${error.response.status})`);
    apiError.status = error.response.status;
    throw apiError;
  }
}
