import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Use 10.0.2.2 for Android emulator, localhost for Web/iOS
const BASE_URL = Platform.OS === "android" ? "http://10.0.2.2:5000/api" : "http://localhost:5000/api";

type ApiOptions = {
  distributorId?: string | null;
  body?: any;
};

async function getHeaders(distributorId?: string | null) {
  const token = await AsyncStorage.getItem("jwt_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  if (distributorId) {
    headers["X-Distributor-Id"] = distributorId;
  }
  
  return headers;
}

export const api = {
  get: async (endpoint: string, options?: ApiOptions) => {
    const headers = await getHeaders(options?.distributorId);
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
    });
    return res.json();
  },
  
  post: async (endpoint: string, options?: ApiOptions) => {
    const headers = await getHeaders(options?.distributorId);
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });
    return res.json();
  },
  
  put: async (endpoint: string, options?: ApiOptions) => {
    const headers = await getHeaders(options?.distributorId);
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });
    return res.json();
  },
  
  delete: async (endpoint: string, options?: ApiOptions) => {
    const headers = await getHeaders(options?.distributorId);
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });
    return res.json();
  },
};
