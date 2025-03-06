/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { APPLICATIONS_GENERATE_IMPACT_REPORT } from 'in-services/tracking/tracking';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';

export interface TrackingFunctions {
  applicationsEumImpactedUsers: (e?: Object) => void;
}

export const useEumTracker = (): TrackingFunctions => {
  const { trackCta } = useSegmentTracking();
  const applicationsEumImpactedUsers = (e?: Object) => trackCta(APPLICATIONS_GENERATE_IMPACT_REPORT, e);

  return {
    applicationsEumImpactedUsers
  };
};
