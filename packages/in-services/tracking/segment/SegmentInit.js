/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { AnalyticsBrowser } from '@segment/analytics-next';

import { segmentAnalyticsEnabled } from 'in-services/featureFlags';
import { ampCompanyInfoEnabled } from 'in-services/featureFlags';
import { customRealmName } from 'in-services/util/constants';
import { config } from 'in-services/config';

let analytics = null;

export function Segment() {
  if (!ampCompanyInfoEnabled) return null;
  if (!segmentAnalyticsEnabled) return null;
  if (analytics === null) {
    analytics = AnalyticsBrowser.load({ writeKey: window.instana.config.segmentKey });
    const userId = customRealmName + '-' + config.tenantUnitId;
    analytics.identify(userId);
  }
  return analytics;
}
