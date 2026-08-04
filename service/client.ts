const SERVER_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function apiClient(endpoint: string, options?: RequestInit) {
  const isBrowser = typeof window !== "undefined";
  const baseUrl = isBrowser ? "/api" : SERVER_BASE_URL;

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Status: ${response.status}\n${errorText}`);
  }

  return response.json();
}