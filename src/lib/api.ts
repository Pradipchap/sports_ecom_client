export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    credentials: "include",
    headers: isFormData
      ? undefined
      : {
          "Content-Type": "application/json",
        },
    body: options.body ? (isFormData ? (options.body as FormData) : JSON.stringify(options.body)) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationMessage =
      Array.isArray(data?.errors) && data.errors.length > 0
        ? data.errors
            .map((issue: { message?: string; path?: string[] }) =>
              issue?.path?.length ? `${issue.path.join(".")}: ${issue.message}` : issue?.message
            )
            .filter(Boolean)
            .join(", ")
        : "";
    const message = validationMessage || data?.message || "Something went wrong";
    throw new Error(message);
  }

  return data as T;
}

export const resolveImageUrl = (imageUrl: string) => {
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${API_URL}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
};
