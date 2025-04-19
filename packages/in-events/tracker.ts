/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { EventTrackerProps } from 'in-services/tracking/segment/types';
import { CTA_CLICKED } from 'in-services/util/constants';

export function manualCloseCTATracker(EVENT_NAME: string, path: string, label?: string, data?: string) {
  const { pageRootName, productArea } = getViewTrackingMetaData();
  if (pageRootName && productArea) {
    const instrumentationInfo = {
      parentPageName: pageRootName,
      parentPageCategory: productArea,
      CTA: EVENT_NAME,
      channel: 'manual close',
      path: path,
      label: label,
      data: data
    } as EventTrackerProps['data'];

    eventTracker({ data: instrumentationInfo, segmentEventName: CTA_CLICKED });
  }
}
