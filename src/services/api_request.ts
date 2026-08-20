const RETRY_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 500;

function isRetryable(status: number): boolean {
  return status >= 500;
}

function retryDelay(attempt: number): Promise<void> {
  // Exponential backoff with ±20% jitter: 500ms, ~1s, ~2s
  const base = RETRY_BASE_DELAY_MS * 2 ** attempt;
  const jitter = base * 0.2 * (Math.random() * 2 - 1);
  return new Promise((resolve) => setTimeout(resolve, base + jitter));
}

export default class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = import.meta.env.VITE_BOLAO_BASE_URL || '') {
    this.baseUrl = baseUrl;
  }

  public async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    const requestOptions: RequestInit = {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...headers },
      method: 'GET'
    };
    const url = `${this.baseUrl}${endpoint}`;

    return this.fetchWithRetry<T>(url, requestOptions);
  }

  public async post<T>(endpoint: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
    const requestOptions: RequestInit = {
      body: JSON.stringify(data),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...headers },
      method: 'POST'
    };
    const url = `${this.baseUrl}${endpoint}`;

    return this.fetchWithRetry<T>(url, requestOptions);
  }

  public async websocket(endpoint: string) {
    const url = `${this.baseUrl}${endpoint}`;
    return new WebSocket(url);
  }

  private async fetchWithRetry<T>(url: string, requestOptions: RequestInit): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt++) {
      try {
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          if (isRetryable(response.status) && attempt < RETRY_ATTEMPTS - 1) {
            await retryDelay(attempt);
            continue;
          }
          const errorBody = await response.json().catch(() => ({}));
          throw new Error(errorBody.message ?? `HTTP ${response.status}`);
        }

        const jsonResponse: { data: T } = await response.json();
        return jsonResponse.data;
      } catch (error) {
        // Re-throw non-retryable errors (4xx, parsing errors) immediately
        if (error instanceof Error && !isNetworkError(error)) {
          throw error;
        }
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < RETRY_ATTEMPTS - 1) {
          await retryDelay(attempt);
        }
      }
    }

    throw lastError ?? new Error('Request failed');
  }
}

function isNetworkError(error: Error): boolean {
  // TypeError is thrown by fetch on network failures (offline, DNS, CORS, timeout)
  return error instanceof TypeError;
}
