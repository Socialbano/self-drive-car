import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// ======================================
// REUSABLE AUTH HELPERS
// For API route protection & role-based access
// ======================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPER_ADMIN_EMAIL = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || 'developer@socialbano.in';

/**
 * Authenticate a request using JWT Bearer token from Authorization header.
 * Returns the authenticated Supabase user object or null.
 */
export async function authenticateRequest(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '') || null;

    if (!token) return null;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Check if the given user email matches the super admin.
 */
export function isSuperAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email === SUPER_ADMIN_EMAIL;
}

/**
 * Standard 401 Unauthorized response.
 */
export function unauthorizedResponse(message = 'Unauthorized: Authentication required') {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Standard 403 Forbidden response.
 */
export function forbiddenResponse(message = 'Forbidden: Insufficient permissions') {
  return NextResponse.json({ error: message }, { status: 403 });
}

/**
 * Standard 400 Bad Request response.
 */
export function badRequestResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

/**
 * Standard 500 Internal Server Error response.
 */
export function serverErrorResponse(message = 'Internal Server Error') {
  return NextResponse.json({ error: message }, { status: 500 });
}

// ======================================
// INPUT SANITIZATION
// ======================================

/**
 * Strip HTML tags from a string to prevent XSS.
 * Use for all user-submitted text before database insertion.
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')          // Strip HTML tags
    .replace(/javascript:/gi, '')     // Strip javascript: protocol
    .replace(/on\w+\s*=/gi, '')       // Strip event handlers (onclick=, etc.)
    .trim();
}

/**
 * Sanitize an entire object's string values (shallow).
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj } as any;
  for (const key of Object.keys(sanitized)) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key]);
    }
  }
  return sanitized as T;
}

// ======================================
// PII MASKING
// ======================================

/**
 * Mask Aadhaar number: XXXX-XXXX-1234
 */
export function maskAadhaar(value?: string | null): string {
  if (!value) return '';
  const cleaned = value.replace(/\s|-/g, '');
  if (cleaned.length < 4) return '****';
  return `XXXX-XXXX-${cleaned.slice(-4)}`;
}

/**
 * Mask Driving License: DL********5678
 */
export function maskDrivingLicense(value?: string | null): string {
  if (!value) return '';
  const cleaned = value.replace(/\s/g, '');
  if (cleaned.length < 4) return '****';
  return `${cleaned.slice(0, 2)}${'*'.repeat(Math.max(cleaned.length - 6, 4))}${cleaned.slice(-4)}`;
}

/**
 * Mask phone number: +91 ****-**6789
 */
export function maskPhone(value?: string | null): string {
  if (!value) return '';
  const cleaned = value.replace(/\s|-/g, '');
  if (cleaned.length < 4) return '****';
  return `${'*'.repeat(cleaned.length - 4)}${cleaned.slice(-4)}`;
}

/**
 * Mask email: d***r@example.com
 */
export function maskEmail(value?: string | null): string {
  if (!value || !value.includes('@')) return '';
  const [localPart, domain] = value.split('@');
  if (localPart.length <= 2) return `${localPart}@${domain}`;
  return `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart.slice(-1)}@${domain}`;
}

// ======================================
// RATE LIMITING (Simple in-memory)
// ======================================

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple in-memory rate limiter.
 * @param key - Unique identifier (e.g., IP address or route+IP)
 * @param maxRequests - Max requests allowed in the window
 * @param windowMs - Time window in milliseconds (default: 60s)
 * @returns true if rate limited (should block), false if allowed
 */
export function isRateLimited(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return true;
  }

  return false;
}

/**
 * Get client IP from request headers.
 */
export function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
}

// Cleanup stale rate limit entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((entry, key) => {
      if (now > entry.resetAt) {
        rateLimitStore.delete(key);
      }
    });
  }, 300000);
}
