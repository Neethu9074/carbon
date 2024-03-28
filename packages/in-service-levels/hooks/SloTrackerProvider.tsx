/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';

import { BlueprintType, ServiceLevelIndicatorType, SloEntity, TimeWindow } from '@instana/types';

import {
  SLI_MANAGEMENT_VIEW,
  SLI_MANAGEMENT_EXIT,
  SLI_MANAGEMENT_CREATE_START,
  SLI_MANAGEMENT_CREATE_FINISH,
  SLI_MANAGEMENT_EDIT_START,
  SLI_MANAGEMENT_EDIT_FINISH,
  SLO_WIDGET_EDIT_START,
  SLI_MANAGEMENT_DELETE,
  SLO_LIST_VIEW,
  SLO_SUMMARY_VIEW,
  SLO_CONFIG_VIEW,
  SLO_CONFIG_DELETE_START,
  SLO_CONFIG_DELETE_FINISH,
  SLO_CONFIG_DIALOG_OPEN,
  SLO_CONFIG_DIALOG_CLOSE,
  SLO_CONFIG_DIALOG_ERROR,
  SLO_CONFIG_DIALOG_FINISH,
  SLO_CONFIG_DELETE_ERROR,
  APDEX_WIDGET_EDIT_START,
  APDEX_MANAGEMENT_VIEW,
  APDEX_MANAGEMENT_EXIT,
  APDEX_MANAGEMENT_CREATE_START,
  APDEX_MANAGEMENT_CREATE_FINISH,
  APDEX_MANAGEMENT_EDIT_START,
  APDEX_MANAGEMENT_EDIT_FINISH,
  APDEX_MANAGEMENT_DELETE
} from 'in-services/tracking/eventNames';
// eslint-disable-next-line no-restricted-imports
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
// eslint-disable-next-line no-restricted-imports
import { SliType } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { CreateSloDialogMode } from 'in-service-levels/components/ConfigDialog/createSloForm';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';
import { track } from 'in-services/tracking/trackers';

interface SloTrackingEventPayload {
  id?: string;
  mode: CreateSloDialogMode;
  entityType: SloEntity['type'];
  blueprint: BlueprintType;
  indicatorType: ServiceLevelIndicatorType;
  timeWindowType: TimeWindow['type'];
}

interface SloErrorTrackingEventPayload {
  mode: CreateSloDialogMode;
  code: 'API_ERROR' | 'UNEXPECTED_ERROR' | 'INVALID_SLO_CONFIG';
}

interface SliWidgetTrackingEventPayload {
  entityType: SliType;
}

interface ApdexTrackingEventPayload {
  entityType: ApdexEntityTypes;
}

export const sloTrackers = {
  [SLO_LIST_VIEW]: () => track(SLO_LIST_VIEW, { productArea: productAreas.slo, pageName: pageNames.slo_summary }),
  [SLO_SUMMARY_VIEW]: (e: SloTrackingEventPayload) => track(SLO_SUMMARY_VIEW, { ...e, productArea: productAreas.slo }),
  [SLO_CONFIG_VIEW]: (e: Omit<SloTrackingEventPayload, 'mode'>) =>
    track(SLO_CONFIG_VIEW, { ...e, productArea: productAreas.slo, pageName: pageNames.slo_config }),
  [SLO_CONFIG_DIALOG_OPEN]: () =>
    track(SLO_CONFIG_DIALOG_OPEN, { productArea: productAreas.slo, pageName: pageNames.service_levels }),
  [SLO_CONFIG_DIALOG_CLOSE]: () =>
    track(SLO_CONFIG_DIALOG_CLOSE, { productArea: productAreas.slo, pageName: pageNames.service_levels }),
  [SLO_CONFIG_DIALOG_ERROR]: (e: SloErrorTrackingEventPayload) =>
    track(SLO_CONFIG_DIALOG_ERROR, { ...e, productArea: productAreas.slo, pageName: pageNames.service_levels }),
  [SLO_CONFIG_DIALOG_FINISH]: (e: SloTrackingEventPayload) =>
    track(SLO_CONFIG_DIALOG_FINISH, { ...e, productArea: productAreas.slo, pageName: pageNames.service_levels }),
  [SLO_CONFIG_DELETE_START]: (e: Omit<SloTrackingEventPayload, 'mode'>) =>
    track(SLO_CONFIG_DELETE_START, { ...e, productArea: productAreas.slo, pageName: pageNames.service_levels }),
  [SLO_CONFIG_DELETE_ERROR]: (e: Omit<SloTrackingEventPayload, 'mode'>) =>
    track(SLO_CONFIG_DELETE_ERROR, { ...e, productArea: productAreas.slo, pageName: pageNames.service_levels }),
  [SLO_CONFIG_DELETE_FINISH]: (e: Omit<SloTrackingEventPayload, 'mode'>) =>
    track(SLO_CONFIG_DELETE_FINISH, { ...e, productArea: productAreas.slo, pageName: pageNames.service_levels })
} as const;

export const sliWidgetTrackers = {
  [SLO_WIDGET_EDIT_START]: () => track(SLO_WIDGET_EDIT_START),
  [SLI_MANAGEMENT_VIEW]: (e: SliWidgetTrackingEventPayload) => track(SLI_MANAGEMENT_VIEW, e),
  [SLI_MANAGEMENT_EXIT]: (e: SliWidgetTrackingEventPayload) => track(SLI_MANAGEMENT_EXIT, e),
  [SLI_MANAGEMENT_CREATE_START]: (e: SliWidgetTrackingEventPayload) => track(SLI_MANAGEMENT_CREATE_START, e),
  [SLI_MANAGEMENT_CREATE_FINISH]: (e: SliWidgetTrackingEventPayload) => track(SLI_MANAGEMENT_CREATE_FINISH, e),
  [SLI_MANAGEMENT_EDIT_START]: (e: SliWidgetTrackingEventPayload) => track(SLI_MANAGEMENT_EDIT_START, e),
  [SLI_MANAGEMENT_EDIT_FINISH]: (e: SliWidgetTrackingEventPayload) => track(SLI_MANAGEMENT_EDIT_FINISH, e),
  [SLI_MANAGEMENT_DELETE]: (e: SliWidgetTrackingEventPayload) => track(SLI_MANAGEMENT_DELETE, e)
} as const;

export const apdexWidgetTrackers = {
  [APDEX_WIDGET_EDIT_START]: () => track(APDEX_WIDGET_EDIT_START),
  [APDEX_MANAGEMENT_VIEW]: (e: ApdexTrackingEventPayload) => track(APDEX_MANAGEMENT_VIEW, e),
  [APDEX_MANAGEMENT_EXIT]: (e: ApdexTrackingEventPayload) => track(APDEX_MANAGEMENT_EXIT, e),
  [APDEX_MANAGEMENT_CREATE_START]: (e: ApdexTrackingEventPayload) => track(APDEX_MANAGEMENT_CREATE_START, e),
  [APDEX_MANAGEMENT_CREATE_FINISH]: (e: ApdexTrackingEventPayload) => track(APDEX_MANAGEMENT_CREATE_FINISH, e),
  [APDEX_MANAGEMENT_EDIT_START]: (e: ApdexTrackingEventPayload) => track(APDEX_MANAGEMENT_EDIT_START, e),
  [APDEX_MANAGEMENT_EDIT_FINISH]: (e: ApdexTrackingEventPayload) => track(APDEX_MANAGEMENT_EDIT_FINISH, e),
  [APDEX_MANAGEMENT_DELETE]: (e: ApdexTrackingEventPayload) => track(APDEX_MANAGEMENT_DELETE, e)
} as const;

const allSloTracker = { ...sliWidgetTrackers, ...sloTrackers, ...apdexWidgetTrackers };

export type SloTrackers = typeof sloTrackers;
export type SliWidgetTrackers = typeof sliWidgetTrackers;
export type ApdexWidgetTrackers = typeof apdexWidgetTrackers;
export type AllSloTrackers = typeof allSloTracker;

export function trackSloEvent<EVENT extends keyof AllSloTrackers>(
  event: EVENT,
  payload: Parameters<AllSloTrackers[EVENT]>[0]
) {
  allSloTracker[event](payload as any);
}

const trackerContext = createContext({} as SloTrackersUnion);

type SloTrackersUnion = SloTrackers | SliWidgetTrackers | ApdexWidgetTrackers;
interface SloTrackerProviderProps {
  value: SloTrackersUnion;
}

export function SloTrackerProvider({ value, children }: PropsWithChildren<SloTrackerProviderProps>) {
  return <trackerContext.Provider value={value}>{children}</trackerContext.Provider>;
}

export function useSloTrackers() {
  const trackers = useContext(trackerContext);

  return useMemo(
    () =>
      <EVENT extends keyof AllSloTrackers>(event: EVENT, payload: Parameters<AllSloTrackers[EVENT]>[0]) => {
        const tracker: AllSloTrackers[EVENT] = (trackers as AllSloTrackers)[event];
        tracker(payload as any);
      },
    [trackers]
  );
}
