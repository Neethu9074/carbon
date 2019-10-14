export function escapeSpecialChars(string) {
  // Escape function taken from https://stackoverflow.com/a/494122
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}
