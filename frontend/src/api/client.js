// frontend/src/api/client.js
const API_BASE_URL = "http://localhost:5000/api";

async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("jwt_token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    // Handle unauthorized globally if needed (e.g., clear token and redirect)
    if (response.status === 401) {
       localStorage.removeItem("jwt_token");
       window.location.href = "http://localhost:8081/";
    }
    throw new Error(data.message || "API request failed");
  }

  return data;
}

export const api = {
  get: (endpoint) => fetchWithAuth(endpoint),
  post: (endpoint, body) =>
    fetchWithAuth(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (endpoint, body) =>
    fetchWithAuth(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (endpoint) =>
    fetchWithAuth(endpoint, {
      method: "DELETE",
    }),
};
