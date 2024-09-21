/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useState } from 'react';

import {
  track as trackMixpanel,
  INFRASTRUCTURE_CONTEXT_GUIDE_STACK_LOADED,
  INFRASTRUCTURE_SIDEBAR_RELATED_ENTITIES_EXPANDED,
  INFRASTRUCTURE_SIDEBAR_RELATED_ENTITIES_CLICKED,
  INFRASTRUCTURE_ANALYZE_RELATED_INSTANCES_BUTTON_CLICKED
} from 'in-services/tracking/tracking';
// @ts-expect-error needs ts migration
import { createDurationTracker } from 'in-services/tracking/mixpanel';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { UI_INTERACTION, UI_LOADING } from 'in-services/util/constants';

export const contextGuideStackLoadedDurationTracker = createDurationTracker(INFRASTRUCTURE_CONTEXT_GUIDE_STACK_LOADED);

export type TrackingFunction = (customData: Object, isLoading?: boolean) => void;

export function useSegmentTracker(): {
  contextGuideStackLoadedDurationTrackerSegment: TrackingFunction;
  trackSidebarRelatedEntitiesExpanded: TrackingFunction;
  trackSidebarRelatedEntitiesClicked: TrackingFunction;
  trackAnalyzeInfrastructureButtonClicked: TrackingFunction;
} {
  const [startTime, setStartTime] = useState<number | null>(null);
  const { trackCta, unstable_trackEvent } = useSegmentTracking();

  function contextGuideStackLoadedDurationTrackerSegment(customData: Object, isLoading?: boolean): void {
    if (isLoading) {
      setStartTime(Date.now());

      unstable_trackEvent(
        UI_LOADING,
        { action: INFRASTRUCTURE_CONTEXT_GUIDE_STACK_LOADED, durationInSec: startTime, terminationType: 'Started' },
        customData
      );
    } else if (startTime) {
      const durationInSec = (Date.now() - startTime) / 1000;

      unstable_trackEvent(
        UI_LOADING,
        {
          action: INFRASTRUCTURE_CONTEXT_GUIDE_STACK_LOADED,
          durationInSec,
          terminationType: 'Loaded'
        },
        customData
      );

      setStartTime(null);
    }
  }

  function trackSidebarRelatedEntitiesExpanded(customData: Object): void {
    unstable_trackEvent(UI_INTERACTION, { objectType: INFRASTRUCTURE_SIDEBAR_RELATED_ENTITIES_EXPANDED }, customData);
    trackMixpanel(INFRASTRUCTURE_SIDEBAR_RELATED_ENTITIES_EXPANDED, customData);
  }

  function trackSidebarRelatedEntitiesClicked(customData: Object): void {
    trackCta(INFRASTRUCTURE_SIDEBAR_RELATED_ENTITIES_CLICKED, customData);
  }

  function trackAnalyzeInfrastructureButtonClicked(customData: Object): void {
    trackCta(INFRASTRUCTURE_ANALYZE_RELATED_INSTANCES_BUTTON_CLICKED, customData);
  }

  return {
    contextGuideStackLoadedDurationTrackerSegment,
    trackSidebarRelatedEntitiesExpanded,
    trackSidebarRelatedEntitiesClicked,
    trackAnalyzeInfrastructureButtonClicked
  };
}
