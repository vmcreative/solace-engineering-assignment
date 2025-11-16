export function formatPhone(phone: string | number): string {
  const str = String(phone).replace(/\D/g, "");
  if (str.length !== 10) return String(phone);
  return `(${str.slice(0, 3)}) ${str.slice(3, 6)}-${str.slice(6)}`;
}