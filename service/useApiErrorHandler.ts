"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiError } from "./client";

export function useApiErrorHandler() {
  const router = useRouter();

  return (error: unknown, fallbackMessage = "Something went wrong") => {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        toast.error("Session expired. Please log in again.");
        router.push("/auth/login");
        return;
      }
      toast.error(error.message);
      return;
    }

    toast.error(error instanceof Error ? error.message : fallbackMessage);
  };
}