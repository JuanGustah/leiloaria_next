export const BACKEND_URL =
  typeof window === "undefined"
    ? process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://backend:8080"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
