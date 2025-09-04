/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useCallback } from 'react';

import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { CTA_CLICKED } from 'in-services/util/constants';

export type CtaTrackingFunction = (ctaEvent: string, optionalPayloadData?: Object, channel?: string) => void;
export type UnstableTrackingFunction = (segmentEventName: string, eventData: Object, customData?: Object) => void;

export function useSegmentTracking(): {
  trackCta: CtaTrackingFunction;
  unstable_trackEvent: UnstableTrackingFunction;
} {
  const location = useLocation();

  const trackCta = useCallback(
    (ctaEvent: string, customData?: Object, channel?: string): void => {
      const { pageRootName, productArea } = getViewTrackingMetaData();
      if (pageRootName && productArea) {
        const data = {
          data: JSON.stringify(customData),
          path: location.pathname,
          parentPageName: pageRootName,
          parentPageCategory: productArea,
          CTA: ctaEvent,
          channel: channel
        };
        eventTracker({ segmentEventName: CTA_CLICKED, data });
      }
    },
    [location.pathname]
  );

  /**
   * This is a suggestion, if you start planning to use this function, please reach out
   * to figure out if all requirements will be fulfilled for your purpose.
   */
  const unstable_trackEvent = useCallback(
    (segmentEventName: string, eventData: Object, customData?: Object): void => {
      const { pageRootName, productArea } = getViewTrackingMetaData();
      if (pageRootName && productArea) {
        const data = {
          data: JSON.stringify(customData),
          ...eventData,
          path: location.pathname,
          parentPageName: pageRootName,
          parentPageCategory: productArea
        };
        eventTracker({ segmentEventName, data });
      }
    },
    [location.pathname]
  );

  return { trackCta, unstable_trackEvent };
}
