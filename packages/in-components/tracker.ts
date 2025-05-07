/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import { CHART_ZOOM_INTO_TIMEFRAME, ISSUE_LINK_CLICK, track } from 'in-services/tracking/tracking';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { EventTrackerProps } from 'in-services/tracking/segment/types';
import { UI_INTERACTION } from 'in-services/util/constants';

export const chartZoomInTracker = (e: { chartMetrics: string[] }) => track(CHART_ZOOM_INTO_TIMEFRAME, e);

export const issueClickTracker = ({ path }: { path: string }) => {
  const { pageRootName, productArea } = getViewTrackingMetaData();
  const data = {
    path,
    action: ISSUE_LINK_CLICK,
    parentPageCategory: productArea,
    parentPageName: pageRootName
  } as EventTrackerProps['data'];
  eventTracker({ data, segmentEventName: UI_INTERACTION });
};
