/**
 * Uppercases the first letter of the string.
 */
export function capitalize(string) {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}
