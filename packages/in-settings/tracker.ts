/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  track,
  SETTINGS_ALERT_CHANNEL_CREATE,
  SETTINGS_ALERT_CHANNEL_TEST_CLICK,
  SETTINGS_ALERT_CHANNEL_CLICK,
  SETTINGS_ALERT_CHANNEL_DELETE,
  SETTINGS_ALERT_CHANNEL_EDIT
} from 'in-services/tracking/tracking';
// Import Segment tracker files
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { EventTrackerProps } from 'in-services/tracking/segment/types';
import { CTA_CLICKED } from 'in-services/util/constants';

// Maintained by Team Alert Response
export const createAlertChannelTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_CREATE, e);
export const clickTestAlertChannelTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_TEST_CLICK, e);
export const clickAlertChannelTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_CLICK, e);
export const deleteAlertChannelTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_DELETE, e);
export const editAlertChannelTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_EDIT, e);

// Segment trackers

interface AlertChannelCTATrackingType {
  EVENT_NAME: string;
  path?: string;
  channel?: string;
  additionalLabel?: string;
}

// Common function using CTA_CLICKED.
export const alertChannelCTATrackerSegment = ({
  EVENT_NAME,
  path,
  channel,
  additionalLabel
}: AlertChannelCTATrackingType) => {
  const { pageRootName, productArea } = getViewTrackingMetaData();
  const data = {
    CTA: EVENT_NAME,
    channel: channel,
    parentPageName: pageRootName,
    parentPageCategory: productArea,
    path: path,
    label: additionalLabel
  } as EventTrackerProps['data'];
  eventTracker({ data, segmentEventName: CTA_CLICKED });
};
