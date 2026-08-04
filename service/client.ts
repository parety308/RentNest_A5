// service/client.ts
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function apiClient(
  endpoint: string,
  options?: RequestInit
) {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  } catch {
    // Network failure — backend unreachable, DNS fail, CORS block, offline, etc.
    throw new ApiError(0, "Couldn't reach the server. Check your connection and try again.");
  }

  let body: any = null;
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    try {
      body = await response.json();
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    const message =
      body?.message ||
      (response.status === 401
        ? "Your session has expired. Please log in again."
        : response.status === 403
        ? "You don't have permission to do that."
        : response.status === 404
        ? "We couldn't find what you were looking for."
        : response.status >= 500
        ? "Something went wrong on our end. Please try again shortly."
        : "Something went wrong. Please try again.");

    throw new ApiError(response.status, message, body);
  }

  return body;
}