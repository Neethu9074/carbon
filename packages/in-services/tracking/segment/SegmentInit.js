/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { AnalyticsBrowser } from '@segment/analytics-next';

import { segmentAnalyticsEnabled } from 'in-services/featureFlags';
import { customRealmName } from 'in-services/util/constants';
import { user } from 'in-stores/user';

let analytics = null;

export function Segment() {
  if (!segmentAnalyticsEnabled) return null;
  if (analytics === null && user?.id) {
    analytics = AnalyticsBrowser.load({ writeKey: window.instana.config.segmentKey });
    const userId = customRealmName + '-' + user.id;
    analytics.identify(userId);
  }
  return analytics;
}
