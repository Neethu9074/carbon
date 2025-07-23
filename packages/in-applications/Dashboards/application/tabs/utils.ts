/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

export function isConcertEnabledFromToken(): boolean {
  return !!window._solis_meta?.concert;
}

export function isTurboEnabled() {
  return !!window._solis_meta?.turbonomic;
}
