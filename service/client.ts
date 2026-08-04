const SERVER_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL;

export async function apiClient(
  endpoint: string,
  options?: RequestInit
) {
  const response = await fetch(`${SERVER_BASE_URL}${endpoint}`, {
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