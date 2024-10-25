/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export function safeParseJSON<T>(str: string = '{}') {
  try {
    return JSON.parse(str) as T;
  } catch {
    return {};
  }
}
