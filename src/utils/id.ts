export async function generateStableId(obj: any) {
  const stableString = `${obj.firstName}-${obj.lastName}-${obj.city}-${obj.degree}`;

  try {
    const hash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(stableString)
    );

    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return `fallback-${Math.random().toString(36).slice(2)}`;
  }
}