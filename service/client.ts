const isServer = typeof window === "undefined";

const SERVER_BASE_URL =
  process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL;

export async function apiClient(
  endpoint: string,
  options?: RequestInit
) {
  const url = isServer
    ? `${SERVER_BASE_URL}${endpoint}`
    : `/api${endpoint}`;

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Status: ${response.status}\n${errorText}`
    );
  }

  return response.json();
}