/**
 * Parse raw notification text into an airtime purchase object.
 * Returns { amount, provider, dateISO, dedupeKey } or null.
 * Uses simple heuristics and a simple hash function for dedupeKey.
 */

function hashString(str) {
  // Simple DJB2 hash
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString();
}

export default function parseAutoImportText(text, timestamp) {
  if (!text) return null;
  const lower = text.toLowerCase();

  const airtimeKeywords = ["airtime", "recharge", "top up", "topup"];
  const successKeywords = ["successful", "success", "completed", "confirmed"];
  const hasAirtime = airtimeKeywords.some((kw) => lower.includes(kw));
  const hasSuccess = successKeywords.some((kw) => lower.includes(kw));
  if (!hasAirtime || !hasSuccess) return null;

  // Amount extraction
  const amountMatch =
    text.match(/₦\s?(\d{2,7})/) ||
    text.match(/N\s?(\d{2,7})/) ||
    text.match(/NGN\s?(\d{2,7})/) ||
    text.match(/(\d{2,7})\s?NGN/i);
  if (!amountMatch) return null;
  const amount = parseInt(amountMatch[1].replace(/,/g, ""), 10);
  if (!amount || amount <= 0) return null;

  // Provider detection
  let provider = "Unknown";
  if (lower.includes("mtn")) provider = "MTN";
  else if (lower.includes("airtel")) provider = "Airtel";
  else if (lower.includes("glo")) provider = "Glo";
  else if (lower.includes("9mobile") || lower.includes("9mobile"))
    provider = "9mobile";

  const dateObj = timestamp ? new Date(timestamp) : new Date();
  const dateISO = dateObj.toISOString();

  // Deduplication key: combine provider, amount, rounded minute, and normalized text
  const rounded = new Date(dateObj);
  rounded.setSeconds(0, 0);
  const dedupeKey = hashString(
    `${provider}|${amount}|${rounded.toISOString()}|${lower}`,
  );

  return { amount, provider, dateISO, dedupeKey };
}
