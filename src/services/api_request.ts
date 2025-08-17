export default class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = import.meta.env.VITE_BOLAO_BASE_URL || '') {
    this.baseUrl = baseUrl;
  }

  public async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(data),
      credentials: 'include',
    };
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error);
    }

    return (await response.json()) as T;
  }

  public async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...headers },
      credentials: 'include',
    };
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      const error = await response.json();
      // get error message from body or default to response status
      throw new Error(error);
    }

    return (await response.json()) as T;
  }
}
