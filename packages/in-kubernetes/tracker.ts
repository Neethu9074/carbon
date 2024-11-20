/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { KUBERNETES_DASHBOARD_TAB_CHANGE, KUBERNETES_TIME_SHIFT_SELECT } from 'in-services/tracking/tracking';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { EventTrackerProps } from 'in-services/tracking/segment/types';
import { UI_INTERACTION } from 'in-services/util/constants';

interface UIInteractionPayload extends Object {
  path: string;
}

export type TrackingFunction = (customData: UIInteractionPayload) => void;

export function useSegmentTracker(): {
  k8sTabChange: TrackingFunction;
  kubernetesTimeShiftSelectTracker: TrackingFunction;
} {
  function k8sTabChange(customData: UIInteractionPayload): void {
    dispatchSegmentUIInteractionEvent(KUBERNETES_DASHBOARD_TAB_CHANGE, customData);
  }

  function kubernetesTimeShiftSelectTracker(customData: UIInteractionPayload): void {
    dispatchSegmentUIInteractionEvent(KUBERNETES_TIME_SHIFT_SELECT, customData);
  }

  return {
    k8sTabChange,
    kubernetesTimeShiftSelectTracker
  };
}

function dispatchSegmentUIInteractionEvent(customEvent: string, customData: UIInteractionPayload) {
  const { pageRootName, productArea } = getViewTrackingMetaData();
  const { path, ...props } = customData;
  const data = {
    parentPageCategory: productArea,
    parentPageName: pageRootName,
    path,
    payload: {
      ...props
    },
    action: customEvent
  } as EventTrackerProps['data'];

  eventTracker({ data, segmentEventName: UI_INTERACTION });
}
