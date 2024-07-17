/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';

export const segmentTrackingFunc = (CTA_TRACK_NAME: string, EVENT_NAME: string) => {
  const { pageRootName, productArea } = getViewTrackingMetaData();

  if (pageRootName && productArea) {
    const data = {
      parentPageName: pageRootName,
      parentPageCategory: productArea,
      CTA: CTA_TRACK_NAME,
      path: location?.pathname
    };
    eventTracker({ data, segmentEventName: EVENT_NAME });
  }
};
