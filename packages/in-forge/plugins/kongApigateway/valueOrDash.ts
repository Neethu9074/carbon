/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

export function valueOrDash(value: any): string {
  return value ? String(value) : '-';
}
