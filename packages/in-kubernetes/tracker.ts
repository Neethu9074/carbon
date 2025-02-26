/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  KUBERNETES_DASHBOARD_TAB_CHANGE,
  KUBERNETES_TIME_SHIFT_SELECT,
  KUBERNETES_VIEW_MODE_TOGGLED,
  KUBERNETES_SEARCH_QUERY_CHANGED,
  KUBERNETES_SEARCH_BAR_CLEARED,
  KUBERNETES_SORTING_CHANGED,
  KUBERNETES_CARD_CLICKED
} from 'in-services/tracking/tracking';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { EventTrackerProps } from 'in-services/tracking/segment/types';
import { UI_INTERACTION } from 'in-services/util/constants';

interface UIInteractionPayload extends Object {
  path?: string;
  switchedToView?: string;
  tab?: string;
  query?: string;
  orderBy?: string;
  orderDirection?: string;
  href?: string;
  cardTitle?: string;
}

export type TrackingFunction = (customData: UIInteractionPayload) => void;

export function useKubernetesTracker(): {
  k8sTabChange: TrackingFunction;
  kubernetesTimeShiftSelectTracker: TrackingFunction;
  kubernetesViewModeToggled: TrackingFunction;
  kubernetesSearchQueryChanged: TrackingFunction;
  kubernetesSearchBarCleared: TrackingFunction;
  kubernetesSortingChanged: TrackingFunction;
  kubernetesCardClicked: TrackingFunction;
} {
  const { trackCta } = useSegmentTracking();

  function k8sTabChange(customData: UIInteractionPayload): void {
    dispatchSegmentUIInteractionEvent(KUBERNETES_DASHBOARD_TAB_CHANGE, customData);
  }

  function kubernetesTimeShiftSelectTracker(customData: UIInteractionPayload): void {
    dispatchSegmentUIInteractionEvent(KUBERNETES_TIME_SHIFT_SELECT, customData);
  }

  function kubernetesViewModeToggled(customData: UIInteractionPayload): void {
    trackCta(KUBERNETES_VIEW_MODE_TOGGLED, customData);
  }

  function kubernetesSearchQueryChanged(customData: UIInteractionPayload): void {
    dispatchSegmentUIInteractionEvent(KUBERNETES_SEARCH_QUERY_CHANGED, customData);
  }

  function kubernetesSearchBarCleared(customData: UIInteractionPayload): void {
    dispatchSegmentUIInteractionEvent(KUBERNETES_SEARCH_BAR_CLEARED, customData);
  }

  function kubernetesSortingChanged(customData: UIInteractionPayload): void {
    dispatchSegmentUIInteractionEvent(KUBERNETES_SORTING_CHANGED, customData);
  }

  function kubernetesCardClicked(customData: UIInteractionPayload): void {
    trackCta(KUBERNETES_CARD_CLICKED, customData);
  }

  return {
    k8sTabChange,
    kubernetesTimeShiftSelectTracker,
    kubernetesViewModeToggled,
    kubernetesSearchQueryChanged,
    kubernetesSearchBarCleared,
    kubernetesSortingChanged,
    kubernetesCardClicked
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
