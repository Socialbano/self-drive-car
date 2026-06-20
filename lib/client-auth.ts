import { supabase } from '@/lib/supabase/client';

/**
 * Get the current user's access token for authenticated API calls.
 * Returns the JWT token string or null if not authenticated.
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch {
    return null;
  }
}

/**
 * Create Authorization headers with Bearer token.
 * Use this in all admin fetch() calls.
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  if (!token) return {};
  return {
    'Authorization': `Bearer ${token}`,
  };
}

/**
 * Make an authenticated fetch request.
 * Automatically includes the Bearer token.
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = await getAuthHeaders();
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });
}

/**
 * Make an authenticated JSON POST request.
 */
export async function authPost(url: string, body: any): Promise<Response> {
  return authFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/**
 * Strip HTML tags from a string to prevent XSS on the client side.
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')          // Strip HTML tags
    .replace(/javascript:/gi, '')     // Strip javascript: protocol
    .replace(/on\w+\s*=/gi, '')       // Strip event handlers (onclick=, etc.)
    .trim();
}

/**
 * Sanitize rich HTML content by stripping script tags, event handlers, and javascript protocols.
 */
export function sanitizeHTML(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove <script> tags
    .replace(/javascript:/gi, '')                                      // Strip javascript: protocol
    .replace(/on\w+\s*=/gi, '')                                        // Strip event handlers (onclick=, etc.)
    .trim();
}
