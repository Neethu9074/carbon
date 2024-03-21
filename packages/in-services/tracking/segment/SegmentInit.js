/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { AnalyticsBrowser } from '@segment/analytics-next';

export function init() {
  const analytics = AnalyticsBrowser.load({ writeKey: window.instana.config.segmentKey });

  return analytics;
}
