/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { EventTrackerProps } from 'in-services/tracking/segment/types';
import { CTA_CLICKED } from 'in-services/util/constants';

export function maintenanceWindowCTATracker(EVENT_NAME: string, path: string, label?: string, data?: string) {
  const { pageRootName, productArea } = getViewTrackingMetaData();
  if (pageRootName && productArea) {
    const instrumentationInfo = {
      parentPageName: pageRootName,
      parentPageCategory: productArea,
      CTA: EVENT_NAME,
      channel: 'maintenance windows',
      path: path,
      label: label,
      data: data
    } as EventTrackerProps['data'];

    eventTracker({ data: instrumentationInfo, segmentEventName: CTA_CLICKED });
  }
}

// Maybe will be used later
export function maintenanceWindowObjectModification(actionType: string, path: string, label?: string) {
  const { pageRootName, productArea } = getViewTrackingMetaData();

  if (pageRootName && productArea) {
    const data = {
      parentPageName: pageRootName,
      parentPageCategory: productArea,
      objectType: 'maintenance window',
      path: path,
      name: label
    } as EventTrackerProps['data'];
    eventTracker({ data, segmentEventName: actionType });
  }
}
