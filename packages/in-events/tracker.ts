/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  track,
  EVENT_RCA_SUGGESTION_HELPFUL,
  EVENT_RCA_SUGGESTION_UNHELPFUL,
  EVENT_RCA_EXPANDED_CARD,
  EVENT_FEEDBACK_SUBMIT,
  EVENT_FEEDBACK_CLOSED_MANUALLY,
  EVENT_FEEDBACK_NEXT,
  EVENT_FEEDBACK_SKIP,
  EVENT_FEEDBACK_POSITIVE,
  EVENT_FEEDBACK_NEGATIVE,
  EVENT_RCA_FEEDBACK_NEXT,
  EVENT_RCA_FEEDBACK_SKIP,
  EVENT_RCA_FEEDBACK_CLOSED_MANUALLY,
  EVENT_RCA_FEEDBACK_SUBMIT,
  INCIDENT_SUMMARIZATION_HELPFUL,
  INCIDENT_SUMMARIZATION_UNHELPFUL,
  INCIDENT_SUMMARIZATION_SUBMIT,
  INCIDENT_SUMMARIZATION_CLOSED_MANUALLY,
  INCIDENT_SUMMARIZATION_NEXT,
  INCIDENT_SUMMARIZATION_SKIP,
  EVENT_RCA_ANALYZE_CLICK,
  EVENT_RCA_ENTITY_CLICK,
  EVENT_RCA_ASSOCIATED_EVENTS_CLICK,
  EVENT_RCA_TRACE_AND_ERROR_LOGS_CLICK
} from 'in-services/tracking/tracking';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { EventTrackerProps } from 'in-services/tracking/segment/types';
import { CTA_CLICKED } from 'in-services/util/constants';

export const helpfulRCASuggestionTracker = (e: Object) => track(EVENT_RCA_SUGGESTION_HELPFUL, e);
export const unhelpfulRCASuggestionTracker = (e: Object) => track(EVENT_RCA_SUGGESTION_UNHELPFUL, e);
export const expandedRCAEventCardTracker = (e: Object) => track(EVENT_RCA_EXPANDED_CARD, e);
export const RCAFeedbackNextTracker = (e: Object) => track(EVENT_RCA_FEEDBACK_NEXT, e);
export const RCAFeedbackSkipTracker = (e: Object) => track(EVENT_RCA_FEEDBACK_SKIP, e);
export const RCAFeedbackClosedManuallyTracker = (e: Object) => track(EVENT_RCA_FEEDBACK_CLOSED_MANUALLY, e);
export const RCAFeedbackSubmitTracker = (e: Object) => track(EVENT_RCA_FEEDBACK_SUBMIT, e);
export const RCAClickThroughToAnalyze = (e: Object) => track(EVENT_RCA_ANALYZE_CLICK, e);
export const RCAClickThroughToEntity = (e: Object) => track(EVENT_RCA_ENTITY_CLICK, e);
export const RCAAssociatedEventsClick = (e: Object) => track(EVENT_RCA_ASSOCIATED_EVENTS_CLICK, e);
export const RCATraceLogsClick = (e: Object) => track(EVENT_RCA_TRACE_AND_ERROR_LOGS_CLICK, e);

export const eventFeedbackSubmitTracker = (e: Object) => track(EVENT_FEEDBACK_SUBMIT, e);
export const eventFeedbackClosedManuallyTracker = (e: Object) => track(EVENT_FEEDBACK_CLOSED_MANUALLY, e);
export const eventFeedbackNextTracker = (e: Object) => track(EVENT_FEEDBACK_NEXT, e);
export const eventFeedbackSkipTracker = (e: Object) => track(EVENT_FEEDBACK_SKIP, e);
export const eventFeedbackPositiveTracker = (e: Object) => track(EVENT_FEEDBACK_POSITIVE, e);
export const eventFeedbackNegativeTracker = (e: Object) => track(EVENT_FEEDBACK_NEGATIVE, e);

export const incidentSummarizationFeedbackHelpfulTracker = (e: Object) => track(INCIDENT_SUMMARIZATION_HELPFUL, e);
export const incidentSummarizationFeedbackUnhelpfulTracker = (e: Object) => track(INCIDENT_SUMMARIZATION_UNHELPFUL, e);
export const incidentSummarizationFeedbackSubmitTracker = (e: Object) => track(INCIDENT_SUMMARIZATION_SUBMIT, e);
export const incidentSummarizationFeedbackClosedManuallyTracker = (e: Object) =>
  track(INCIDENT_SUMMARIZATION_CLOSED_MANUALLY, e);
export const incidentSummarizationFeedbackNextTracker = (e: Object) => track(INCIDENT_SUMMARIZATION_NEXT, e);
export const incidentSummarizationFeedbackSkipTracker = (e: Object) => track(INCIDENT_SUMMARIZATION_SKIP, e);

export function rootCauseAnalysisSegmentTracker(eventName: string, path: string, label?: string) {
  const { pageRootName, productArea } = getViewTrackingMetaData();
  if (pageRootName && productArea) {
    const data = {
      parentPageName: pageRootName,
      parentPageCategory: productArea,
      CTA: eventName,
      channel: 'root cause analysis',
      path: path,
      label: label
    } as EventTrackerProps['data'];

    eventTracker({ data, segmentEventName: CTA_CLICKED });
  }
}

export function eventFeedbackSegmentTracker(eventName: string, path: string, label?: string) {
  const { pageRootName, productArea } = getViewTrackingMetaData();
  if (pageRootName && productArea) {
    const data = {
      parentPageName: pageRootName,
      parentPageCategory: productArea,
      CTA: eventName,
      channel: 'event feedback',
      path: path,
      label: label
    } as EventTrackerProps['data'];

    eventTracker({ data, segmentEventName: CTA_CLICKED });
  }
}
