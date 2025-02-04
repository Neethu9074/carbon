/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';

import { BlueprintType, ServiceLevelIndicatorType, SloEntity, TimeWindow } from '@instana/types';
import { generateStableHash } from '@instana/utils';

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
  APDEX_MANAGEMENT_DELETE,
  SLO2_WIDGET_EDIT_START,
  SLO2_BIG_NUMBER_WIDGET_EDIT_START
} from 'in-services/tracking/eventNames';
// eslint-disable-next-line no-restricted-imports
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
// eslint-disable-next-line no-restricted-imports
import { SliType } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import { CtaTrackingFunction, useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { CreateSloDialogMode } from 'in-service-levels/components/ConfigDialog/createSloForm';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { ProductArea } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { PageName } from 'in-services/tracking/pageNames';

export interface SloTrackingMeta {
  productArea: ProductArea;
  pageName: PageName;
}

interface SloTrackingEventPayload {
  id?: string;
  mode: CreateSloDialogMode;
  entityType: SloEntity['type'];
  blueprint: BlueprintType;
  indicatorType?: ServiceLevelIndicatorType;
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
  [SLO_LIST_VIEW]: (e: undefined, tracker: CtaTrackingFunction) => tracker(SLO_LIST_VIEW, e),
  [SLO_SUMMARY_VIEW]: (e: Omit<SloTrackingEventPayload, 'mode'>, tracker: CtaTrackingFunction) =>
    tracker(SLO_SUMMARY_VIEW, e),
  [SLO_CONFIG_VIEW]: (e: Omit<SloTrackingEventPayload, 'mode'>, tracker: CtaTrackingFunction) =>
    tracker(SLO_CONFIG_VIEW, e),
  [SLO_CONFIG_DIALOG_OPEN]: (e: undefined, tracker: CtaTrackingFunction) => tracker(SLO_CONFIG_DIALOG_OPEN, e),
  [SLO_CONFIG_DIALOG_CLOSE]: (e: undefined, tracker: CtaTrackingFunction) => tracker(SLO_CONFIG_DIALOG_CLOSE, e),
  [SLO_CONFIG_DIALOG_ERROR]: (e: SloErrorTrackingEventPayload, tracker: CtaTrackingFunction) =>
    tracker(SLO_CONFIG_DIALOG_ERROR, e),
  [SLO_CONFIG_DIALOG_FINISH]: (e: SloTrackingEventPayload, tracker: CtaTrackingFunction) =>
    tracker(SLO_CONFIG_DIALOG_FINISH, e),
  [SLO_CONFIG_DELETE_START]: (e: Omit<SloTrackingEventPayload, 'mode'>, tracker: CtaTrackingFunction) =>
    tracker(SLO_CONFIG_DELETE_START, e),
  [SLO_CONFIG_DELETE_ERROR]: (e: Omit<SloTrackingEventPayload, 'mode'>, tracker: CtaTrackingFunction) =>
    tracker(SLO_CONFIG_DELETE_ERROR, e),
  [SLO_CONFIG_DELETE_FINISH]: (e: Omit<SloTrackingEventPayload, 'mode'>, tracker: CtaTrackingFunction) =>
    tracker(SLO_CONFIG_DELETE_FINISH, e)
} as const;

export const sliWidgetTrackers = {
  [SLO_WIDGET_EDIT_START]: (e: undefined, tracker: CtaTrackingFunction) => tracker(SLO_WIDGET_EDIT_START, e),
  [SLI_MANAGEMENT_VIEW]: (e: SliWidgetTrackingEventPayload, tracker: CtaTrackingFunction) =>
    tracker(SLI_MANAGEMENT_VIEW, e),
  [SLI_MANAGEMENT_EXIT]: (e: SliWidgetTrackingEventPayload, tracker: CtaTrackingFunction) =>
    tracker(SLI_MANAGEMENT_EXIT, e),
  [SLI_MANAGEMENT_CREATE_START]: (e: SliWidgetTrackingEventPayload, tracker: CtaTrackingFunction) =>
    tracker(SLI_MANAGEMENT_CREATE_START, e),
  [SLI_MANAGEMENT_CREATE_FINISH]: (e: SliWidgetTrackingEventPayload, tracker: CtaTrackingFunction) =>
    tracker(SLI_MANAGEMENT_CREATE_FINISH, e),
  [SLI_MANAGEMENT_EDIT_START]: (e: SliWidgetTrackingEventPayload, tracker: CtaTrackingFunction) =>
    tracker(SLI_MANAGEMENT_EDIT_START, e),
  [SLI_MANAGEMENT_EDIT_FINISH]: (e: SliWidgetTrackingEventPayload, tracker: CtaTrackingFunction) =>
    tracker(SLI_MANAGEMENT_EDIT_FINISH, e),
  [SLI_MANAGEMENT_DELETE]: (e: SliWidgetTrackingEventPayload, tracker: CtaTrackingFunction) =>
    tracker(SLI_MANAGEMENT_DELETE, e)
} as const;

export const apdexWidgetTrackers = {
  [APDEX_WIDGET_EDIT_START]: (e: undefined, tracker: CtaTrackingFunction) => tracker(APDEX_WIDGET_EDIT_START, e),
  [APDEX_MANAGEMENT_VIEW]: (e: ApdexTrackingEventPayload, tracker: CtaTrackingFunction) =>
    tracker(APDEX_MANAGEMENT_VIEW, e),
  [APDEX_MANAGEMENT_EXIT]: (e: ApdexTrackingEventPayload, tracker: CtaTrackingFunction) =>
    tracker(APDEX_MANAGEMENT_EXIT, e),
  [APDEX_MANAGEMENT_CREATE_START]: (e: ApdexTrackingEventPayload, tracker: CtaTrackingFunction) =>
    tracker(APDEX_MANAGEMENT_CREATE_START, e),
  [APDEX_MANAGEMENT_CREATE_FINISH]: (e: ApdexTrackingEventPayload, tracker: CtaTrackingFunction) =>
    tracker(APDEX_MANAGEMENT_CREATE_FINISH, e),
  [APDEX_MANAGEMENT_EDIT_START]: (e: ApdexTrackingEventPayload, tracker: CtaTrackingFunction) =>
    tracker(APDEX_MANAGEMENT_EDIT_START, e),
  [APDEX_MANAGEMENT_EDIT_FINISH]: (e: ApdexTrackingEventPayload, tracker: CtaTrackingFunction) =>
    tracker(APDEX_MANAGEMENT_EDIT_FINISH, e),
  [APDEX_MANAGEMENT_DELETE]: (e: ApdexTrackingEventPayload, tracker: CtaTrackingFunction) =>
    tracker(APDEX_MANAGEMENT_DELETE, e)
} as const;

export const sloWidgetTrackers = {
  ...sloTrackers,
  [SLO2_WIDGET_EDIT_START]: (e: undefined, tracker: CtaTrackingFunction) => tracker(SLO2_WIDGET_EDIT_START, e),
  [SLO2_BIG_NUMBER_WIDGET_EDIT_START]: (e: undefined, tracker: CtaTrackingFunction) =>
    tracker(SLO2_BIG_NUMBER_WIDGET_EDIT_START, e)
} as const;

const allSloTracker = { ...sliWidgetTrackers, ...sloTrackers, ...apdexWidgetTrackers, ...sloWidgetTrackers };

export type SloTrackers = typeof sloTrackers;
export type SliWidgetTrackers = typeof sliWidgetTrackers;
export type SloWidgetTrackers = typeof sloWidgetTrackers;
export type ApdexWidgetTrackers = typeof apdexWidgetTrackers;
export type AllSloTrackers = typeof allSloTracker;

type DataProps = Parameters<typeof eventTracker>[0]['data'];

/**
 * This static tracker is necessary to track behavior outside of
 * a valid React context, such as form callbacks.
 **/
export function trackSloEvent<EVENT extends keyof AllSloTrackers>(
  event: EVENT,
  meta: SloTrackingMeta,
  payload: Parameters<AllSloTrackers[EVENT]>[0]
) {
  const { pageName, productArea } = meta;

  const tracker = (e: string, d: DataProps) => {
    const data = {
      data: JSON.stringify(d),
      path: window.location.pathname,
      parentPageName: pageName,
      parentPageCategory: productArea,
      CTA: event
    };

    eventTracker({ segmentEventName: e, data });
  };

  allSloTracker[event](payload as never, tracker as CtaTrackingFunction);
}

export const trackerContext = createContext({} as SloTrackerProviderProps);

type SloTrackersUnion = SloTrackers | SliWidgetTrackers | ApdexWidgetTrackers | SloWidgetTrackers;
interface SloTrackerProviderProps {
  trackers: SloTrackersUnion;
  meta: SloTrackingMeta;
}

export function SloTrackerProvider({ trackers, meta, children }: PropsWithChildren<SloTrackerProviderProps>) {
  return (
    <trackerContext.Provider value={{ trackers, meta }}>
      <ViewTrackingMeta data={{ pageRootName: meta.pageName, productArea: meta.productArea }} />
      {children}
    </trackerContext.Provider>
  );
}

export function useSloTrackers() {
  const { trackers } = useContext(trackerContext);
  const { trackCta } = useSegmentTracking();

  return useMemo(
    () =>
      <EVENT extends keyof AllSloTrackers>(event: EVENT, payload: Parameters<AllSloTrackers[EVENT]>[0]) => {
        const tracker: AllSloTrackers[EVENT] = (trackers as AllSloTrackers)[event];
        tracker(payload as never, trackCta);
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [generateStableHash({ trackers })]
  );
}
