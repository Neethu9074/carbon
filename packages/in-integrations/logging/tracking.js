/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { LOGGING_INTEGRATIONS_INSTANCE_THIRD_PARTY_CLICKED } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';

export const useJumpToThirdParty = () => {
  const { trackCta } = useSegmentTracking();
  return instance => {
    trackCta(LOGGING_INTEGRATIONS_INSTANCE_THIRD_PARTY_CLICKED, instance);
  };
};
