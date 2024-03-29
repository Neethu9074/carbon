/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { AnalyticsBrowser } from '@segment/analytics-next';

let analytics = null;

export function Segment() {
  if (analytics === null) {
    analytics = AnalyticsBrowser.load({ writeKey: window.instana.config.segmentKey });
  }
  return analytics;
}
