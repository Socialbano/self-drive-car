/**
 * Zero-Cost Indian Identity Validation Utilities
 * 1. Aadhaar Number: Verhoeff Checksum Algorithm (UIDAI Standard)
 * 2. Driving License: State Code + RTO + Year + Registration Regex
 */

// Verhoeff algorithm multiplication table (d)
const d: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

// Verhoeff algorithm permutation table (p)
const p: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

const VALID_INDIAN_STATE_CODES = new Set([
  'AN', 'AP', 'AR', 'AS', 'BR', 'CG', 'CH', 'DD', 'DL', 'DN', 'GA', 'GJ',
  'HR', 'HP', 'JH', 'JK', 'KA', 'KL', 'LA', 'LD', 'MH', 'ML', 'MN', 'MP',
  'MZ', 'NL', 'OD', 'OR', 'PB', 'PY', 'RJ', 'SK', 'TN', 'TS', 'TR', 'UA',
  'UK', 'UP', 'WB'
]);

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Validates 12-digit Indian Aadhaar number using UIDAI Verhoeff Checksum Algorithm
 */
export function validateAadhaar(aadhaar: string): ValidationResult {
  const cleanAadhaar = (aadhaar || '').replace(/[\s-]/g, '');

  if (!cleanAadhaar) {
    return { isValid: false, message: '' };
  }

  if (!/^\d{12}$/.test(cleanAadhaar)) {
    return { isValid: false, message: `Aadhaar must be 12 digits (${cleanAadhaar.length}/12)` };
  }

  // Aadhaar numbers starting with 0 or 1 are invalid according to UIDAI rules
  if (cleanAadhaar.startsWith('0') || cleanAadhaar.startsWith('1')) {
    return { isValid: false, message: 'Invalid Aadhaar (Cannot start with 0 or 1)' };
  }

  // Verhoeff checksum algorithm evaluation
  let c = 0;
  const myArray = cleanAadhaar.split('').map(Number).reverse();

  for (let i = 0; i < myArray.length; i++) {
    c = d[c][p[i % 8][myArray[i]]];
  }

  if (c !== 0) {
    return { isValid: false, message: 'Invalid Aadhaar (Checksum failed - Fake ID)' };
  }

  return { isValid: true, message: 'Verified Aadhaar Number' };
}

/**
 * Auto-formats raw digits into XXXX-XXXX-XXXX format for Aadhaar
 */
export function formatAadhaarInput(val: string): string {
  const clean = val.replace(/\D/g, '').slice(0, 12);
  const parts = [];
  for (let i = 0; i < clean.length; i += 4) {
    parts.push(clean.slice(i, i + 4));
  }
  return parts.join('-');
}

/**
 * Validates Indian Driving License format
 */
export function validateDrivingLicense(dl: string): ValidationResult {
  const cleanDL = (dl || '').replace(/[\s-]/g, '').toUpperCase();

  if (!cleanDL) {
    return { isValid: false, message: '' };
  }

  if (cleanDL.length < 13 || cleanDL.length > 16) {
    return { isValid: false, message: `DL length invalid (${cleanDL.length}/15 chars)` };
  }

  const stateCode = cleanDL.substring(0, 2);
  if (!VALID_INDIAN_STATE_CODES.has(stateCode)) {
    return { isValid: false, message: `Invalid State Code '${stateCode}' in DL` };
  }

  // Standard Indian DL Regex: State Code (2) + RTO (2) + Year (4) + 7 Digits
  const standardDLRegex = /^[A-Z]{2}\d{2}(19[8-9]\d|20[0-2]\d)\d{7}$/;
  const flexibleDLRegex = /^[A-Z]{2}\d{11,14}$/;

  if (!standardDLRegex.test(cleanDL) && !flexibleDLRegex.test(cleanDL)) {
    return { isValid: false, message: 'Invalid DL Format (e.g. MP-09-2021-0012345)' };
  }

  return { isValid: true, message: 'Verified DL Format' };
}

/**
 * Formats DL input with clean dashes e.g. MP-09-2021-0012345
 */
export function formatDLInput(val: string): string {
  const clean = val.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 15);
  if (clean.length > 4 && clean.length <= 8) {
    return `${clean.slice(0, 2)}-${clean.slice(2, 4)}-${clean.slice(4)}`;
  } else if (clean.length > 8) {
    return `${clean.slice(0, 2)}-${clean.slice(2, 4)}-${clean.slice(4, 8)}-${clean.slice(8)}`;
  } else if (clean.length > 2) {
    return `${clean.slice(0, 2)}-${clean.slice(2)}`;
  }
  return clean;
}
