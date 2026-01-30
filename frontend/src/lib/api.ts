// frontend/src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function apiRequest(endpoint: string, options: any = {}) {
  // Access localStorage only on the client side
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = {
    // Standardize JSON headers unless sending FormData
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle the specific 429 error we saw in the backend
  if (response.status === 429) {
    throw new Error("The AI Counsellor is over capacity. Please wait 30 seconds.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Server error occurred.");
  }

  return response.json();
}