type ApiErrorBody = {
  error?: unknown;
};

export async function getResponseErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const data = (await response.json().catch(() => null)) as ApiErrorBody | null;

    if (typeof data?.error === "string" && data.error.trim()) {
      return data.error;
    }
  }

  const text = await response.text().catch(() => "");
  const fallback = text.trim();

  return fallback || `Request failed with status ${response.status}.`;
}
