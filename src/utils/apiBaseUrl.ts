export function getApiBaseUrl(): string {
  const url =
    (import.meta.env.VITE_API_URL as string | undefined) ||
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
    'http://localhost:8080'
  return url.replace(/\/+$/, '')
}
