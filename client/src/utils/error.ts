import axios from "axios";

type ApiErrorBody = { message?: string };

export function toMessage(
  e: unknown,
  fallback = "Something went wrong"
): string {
  if (axios.isAxiosError<ApiErrorBody>(e)) {
    return e.response?.data?.message ?? e.message ?? fallback;
  }
  if (e instanceof Error) return e.message || fallback;
  return fallback;
}
