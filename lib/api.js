/*
 * Utility functions for interacting with the signage API server.
 *
 * The API base URL is taken from the environment variable
 * `NEXT_PUBLIC_API_URL`.  During development this should
 * point at the Express server with the `/api` path (e.g. http://localhost:3001/api).
 */

export async function fetchJSON(path, options = {}) {
  const base = process.env.NEXT_PUBLIC_API_URL;
  const url = `${base}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'API error');
  }
  return res.json();
}

export async function getProducts() {
  return fetchJSON('/api/products');
}

export async function getProduct(id) {
  return fetchJSON(`/api/products/${id}`);
}

export async function createRFQ(data) {
  // Submit a request for quote to the API.  Accepts an object
  // containing `projectTitle`, `email`, `description` and an optional
  // array of File objects under `files`.
  const base = process.env.NEXT_PUBLIC_API_URL;
  const url = `${base}/rfq`;
  const formData = new FormData();
  // Append scalar fields
  if (data.projectTitle) formData.append('projectTitle', data.projectTitle);
  if (data.email) formData.append('email', data.email);
  if (data.description) formData.append('description', data.description);
  // Append files (allow multiple)
  if (data.files && Array.isArray(data.files)) {
    data.files.forEach((file) => {
      if (file) formData.append('files', file);
    });
  }
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'API error');
  }
  return res.json();
}