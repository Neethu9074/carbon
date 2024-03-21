/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

//@ts-expect-error
import { Segment, commonProperties } from 'in-services/tracking/segment/SegmentInit';
import { config } from 'in-services/config';

interface SegmentEventTrackerProps {
  parentProductArea: string;
  parentPageName: string;
  eventName: string;
}
const segment = Segment();
const url = window.location.href;
const path = window.location.pathname;
const instanceId = config.tenantUnit;
export const eventTracker = ({ eventName, parentProductArea, parentPageName }: SegmentEventTrackerProps) => {
  segment.track(eventName, { parentProductArea, parentPageName, commonProperties, url, path, instanceId });
};
