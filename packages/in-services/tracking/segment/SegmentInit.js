/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { AnalyticsBrowser } from '@segment/analytics-next';

import { commomMilestoneVersion, productCode, productCodeType, productTitle, ut30 } from 'in-services/util/constants';

let analytics = null;

export const commonProperties = {
  productTitle: productTitle,
  ut30: ut30,
  productCodeType: productCodeType,
  productCode: productCode,
  commomMilestoneVersion: commomMilestoneVersion
};

export function Segment() {
  if (analytics === null) {
    analytics = AnalyticsBrowser.load({ writeKey: window.instana.config.segmentKey });
  }
  return analytics;
}
