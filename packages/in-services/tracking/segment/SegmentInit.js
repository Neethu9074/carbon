/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { AnalyticsBrowser } from '@segment/analytics-next';

import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';

let analytics = null;

const deploymentType = onPremLicenseInformationEnabled ? 'SaaS' : 'Self-Hosted';
export const customRealmName = 'instanaProduct';

export const commonProperties = {
  productTitle: `Observability with Instana (${deploymentType})`,
  ut30: '30AO8',
  productCodeType: 'PID',
  productCode: '5900-AG5',
  commomMilestoneVersion: '2024-03-08 00:01:00'
};

export function Segment() {
  if (analytics === null) {
    analytics = AnalyticsBrowser.load({ writeKey: window.instana.config.segmentKey });
  }
  return analytics;
}
