export async function apiClient(
  endpoint: string,
  options?: RequestInit
) {
  const response = await fetch(`/api${endpoint}`, {
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