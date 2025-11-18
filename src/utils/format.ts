/**
 * formatPhone
 * -----------------------------------------------
 * Normalizes and formats a phone number into a
 * human-friendly U.S. `(XXX) XXX-XXXX` format.
 *
 * The backend (mock or database) stores phone numbers
 * as either:
 *   • a number (e.g., 4155551234), or
 *   • a string (e.g., "415-555-1234")
 *
 * This helper ensures consistent formatting on the UI:
 *
 *   formatPhone(4155551234)
 *     → "(415) 555-1234"
 *
 *   formatPhone("415-555-1234")
 *     → "(415) 555-1234"
 *
 * Behavior:
 *   • Strips all non-digit characters.
 *   • If the result is not exactly 10 digits,
 *     returns the original input unchanged.
 *     (This prevents incorrect formatting for
 *      international or malformed numbers.)
 */

export function formatPhone(phone: string | number): string {
  // Convert to string & remove anything that isn't a digit
  const str = String(phone).replace(/\D/g, "");

  // Only format standard 10-digit US numbers
  if (str.length !== 10) return String(phone);

  // Format: (XXX) XXX-XXXX
  return `(${str.slice(0, 3)}) ${str.slice(3, 6)}-${str.slice(6)}`;
}