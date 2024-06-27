/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { AnalyticsBrowser } from '@segment/analytics-next';

import { segmentAnalyticsEnabled } from 'in-services/featureFlags';
import { ampCompanyInfoEnabled } from 'in-services/featureFlags';
import { customRealmName } from 'in-services/util/constants';
import { getTenantsWithUnitsCached } from 'in-api/account';
import { find } from 'in-services/arrayUtils';
import { config } from 'in-services/config';
import { tenant } from 'in-stores/user';

let analytics = null;

export function Segment() {
  if (!ampCompanyInfoEnabled) return null;
  if (!segmentAnalyticsEnabled) return null;
  if (analytics === null) {
    let tenantUnitId;
    analytics = AnalyticsBrowser.load({ writeKey: window.instana.config.segmentKey });
    getTenantsWithUnitsCached().once(tenantWithUnits => {
      const units = tenantWithUnits[tenant?.name];
      if (!units) {
        return;
      }
      const currentUnit = find(units, unit => unit.tenantUnitName === config.tenantUnit);
      if (currentUnit) {
        tenantUnitId = currentUnit.tenantUnitId;
      }
      const userId = customRealmName + '-' + tenantUnitId;
      analytics.identify(userId);
    });
  }
  return analytics;
}
