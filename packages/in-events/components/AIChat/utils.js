/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// Simple function to convert all string occurrences of
// something.something (which is interpreted as a link) to instead
// be `something.something`.
export function cleanUpText(text) {
  // Regex to find word.word patterns.
  const regex = /(\w+)\.(\w+)/g;
  // Replace matched patterns with the same pattern wrapped in backticks
  return text.replace(regex, '`$1.$2`');
}
