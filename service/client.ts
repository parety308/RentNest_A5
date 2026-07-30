const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiClient(
  endpoint: string,
  options?: RequestInit
) {
  //     console.log("API_URL:", API_URL);
  // console.log("URL:", `${API_URL}${endpoint}`);
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
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