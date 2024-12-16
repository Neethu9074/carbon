/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useEffect } from 'react';

import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { CUSTOM_DASHBOARD_VIEW_WIDGET } from 'in-services/tracking/tracking';
import { getTrackingMeta } from 'in-custom-dashboards/tracker';

export default function ViewTracker({ widget, children }) {
  const { trackCta } = useSegmentTracking();
  // We deliberately only want this to run once!
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => trackCta(CUSTOM_DASHBOARD_VIEW_WIDGET, getTrackingMeta(widget)), []);
  return children;
}
