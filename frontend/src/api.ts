export type User = { id: number; email: string };

const API_BASE = import.meta.env.VITE_API_BASE;

export async function listUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createUser(email: string): Promise<User> {
    const data = { "email": email }
    const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const detail = await response.text(); // shows FastAPI validation error
        throw new Error(`HTTP ${response.status}: ${detail}`);
      }
    
    return response.json();
}