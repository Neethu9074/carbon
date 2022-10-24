/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';

import {
  SLI_MANAGEMENT_VIEW,
  SLI_MANAGEMENT_EXIT,
  SLI_MANAGEMENT_CREATE_START,
  SLI_MANAGEMENT_CREATE_FINISH,
  SLI_MANAGEMENT_EDIT_START,
  SLI_MANAGEMENT_EDIT_FINISH,
  SLO_WIDGET_EDIT_START,
  SLI_MANAGEMENT_DELETE
} from 'in-services/tracking/eventNames';
import { SliType } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { track } from 'in-services/tracking/trackers';

interface SloTrackingEventPayload {
  entityType: SliType;
}

export const defaultTrackers = {
  [SLO_WIDGET_EDIT_START]: () => track(SLO_WIDGET_EDIT_START),
  [SLI_MANAGEMENT_VIEW]: (e: SloTrackingEventPayload) => track(SLI_MANAGEMENT_VIEW, e),
  [SLI_MANAGEMENT_EXIT]: (e: SloTrackingEventPayload) => track(SLI_MANAGEMENT_EXIT, e),
  [SLI_MANAGEMENT_CREATE_START]: (e: SloTrackingEventPayload) => track(SLI_MANAGEMENT_CREATE_START, e),
  [SLI_MANAGEMENT_CREATE_FINISH]: (e: SloTrackingEventPayload) => track(SLI_MANAGEMENT_CREATE_FINISH, e),
  [SLI_MANAGEMENT_EDIT_START]: (e: SloTrackingEventPayload) => track(SLI_MANAGEMENT_EDIT_START, e),
  [SLI_MANAGEMENT_EDIT_FINISH]: (e: SloTrackingEventPayload) => track(SLI_MANAGEMENT_EDIT_FINISH, e),
  [SLI_MANAGEMENT_DELETE]: (e: SloTrackingEventPayload) => track(SLI_MANAGEMENT_DELETE, e)
} as const;

export type SloWidgetTrackers = Partial<typeof defaultTrackers>;
export type SloWidgetTrackerPayload<EVENT extends keyof SloWidgetTrackers> = Parameters<typeof defaultTrackers[EVENT]>;

const trackerContext = createContext<SloWidgetTrackers>({});

interface Props {
  value: SloWidgetTrackers;
}

export function SloWidgetTrackerProvider({ value, children }: PropsWithChildren<Props>) {
  return <trackerContext.Provider value={value}>{children}</trackerContext.Provider>;
}

export function useSloWidgetTrackers() {
  const trackers = useContext(trackerContext);
  return useMemo(
    () => <EVENT extends keyof SloWidgetTrackers>(event: EVENT, ...payload: SloWidgetTrackerPayload<EVENT>) =>
      // @ts-expect-error I currently cant avoid this issue, but the typing to the outside is working as intended so this should not be ans issue
      trackers[event]?.(...payload),
    [trackers]
  );
}
