/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { CTA_CLICKED } from 'in-services/util/constants';
import { track } from 'in-services/tracking/trackers';
import { user } from 'in-stores/user';

// This is the defined tag name <cds-aichat-react> used by the Carbon AI Chat
export const AI_CHAT_TAG_NAME = 'cds-aichat-react';

// We want to track the clicks to segment
/**
 * Handle tracking for a specific element click.
 * @param {string} trackingName - The name of the tracking event.
 */
export function handleTracking(trackingName) {
  const { pageRootName, productArea } = getViewTrackingMetaData();
  if (pageRootName && productArea) {
    const data = {
      parentPageName: pageRootName,
      parentPageCategory: productArea,
      CTA: trackingName,
      path: location.hash
    };
    eventTracker({ data, segmentEventName: CTA_CLICKED });
  }
  track(trackingName, { author: user.preferredName });
}
