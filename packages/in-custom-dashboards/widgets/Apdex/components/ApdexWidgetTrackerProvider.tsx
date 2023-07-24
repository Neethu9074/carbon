/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';

import {
  APDEX_MANAGEMENT_CREATE_FINISH,
  APDEX_MANAGEMENT_CREATE_START,
  APDEX_MANAGEMENT_DELETE,
  APDEX_MANAGEMENT_EDIT_FINISH,
  APDEX_MANAGEMENT_EDIT_START,
  APDEX_MANAGEMENT_EXIT,
  APDEX_MANAGEMENT_VIEW,
  APDEX_WIDGET_EDIT_START
} from 'in-services/tracking/eventNames';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import { track } from 'in-services/tracking/trackers';

interface ApdexTrackingEventPayload {
  entityType: ApdexEntityTypes;
}

export const defaultTrackers = {
  [APDEX_WIDGET_EDIT_START]: () => track(APDEX_WIDGET_EDIT_START),
  [APDEX_MANAGEMENT_VIEW]: (e: ApdexTrackingEventPayload) => track(APDEX_MANAGEMENT_VIEW, e),
  [APDEX_MANAGEMENT_EXIT]: (e: ApdexTrackingEventPayload) => track(APDEX_MANAGEMENT_EXIT, e),
  [APDEX_MANAGEMENT_CREATE_START]: (e: ApdexTrackingEventPayload) => track(APDEX_MANAGEMENT_CREATE_START, e),
  [APDEX_MANAGEMENT_CREATE_FINISH]: (e: ApdexTrackingEventPayload) => track(APDEX_MANAGEMENT_CREATE_FINISH, e),
  [APDEX_MANAGEMENT_EDIT_START]: (e: ApdexTrackingEventPayload) => track(APDEX_MANAGEMENT_EDIT_START, e),
  [APDEX_MANAGEMENT_EDIT_FINISH]: (e: ApdexTrackingEventPayload) => track(APDEX_MANAGEMENT_EDIT_FINISH, e),
  [APDEX_MANAGEMENT_DELETE]: (e: ApdexTrackingEventPayload) => track(APDEX_MANAGEMENT_DELETE, e)
} as const;

export type ApdexWidgetTrackers = Partial<typeof defaultTrackers>;
export type ApdexWidgetTrackerPayload<EVENT extends keyof ApdexWidgetTrackers> = Parameters<
  (typeof defaultTrackers)[EVENT]
>;

const trackerContext = createContext<ApdexWidgetTrackers>({});

interface Props {
  value: ApdexWidgetTrackers;
}

export function ApdexWidgetTrackerProvider({ value, children }: PropsWithChildren<Props>) {
  return <trackerContext.Provider value={value}>{children}</trackerContext.Provider>;
}

export function useApdexWidgetTrackers() {
  const trackers = useContext(trackerContext);
  return useMemo(
    () =>
      <EVENT extends keyof ApdexWidgetTrackers>(event: EVENT, ...payload: ApdexWidgetTrackerPayload<EVENT>) =>
        // @ts-expect-error I currently cant avoid this issue, but the typing to the outside is working as intended so this should not be any issue
        trackers[event]?.(...payload),
    [trackers]
  );
}
