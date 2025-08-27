/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import { OUT } from 'in-subscription/getAgentSnapshotsInTimeframe';

export function isConcertEnabledFromToken(): boolean {
  return !!window._solis_meta?.concert;
}

export function isTurboEnabled() {
  return !!window._solis_meta?.turbonomic;
}

export function isAgentEnabled(agentResponse: OUT | null | undefined) {
  if (agentResponse == null) {
    return false;
  }
  if (agentResponse.progress.loading) {
    return false;
  } else {
    return !!agentResponse.data?.online;
  }
}
