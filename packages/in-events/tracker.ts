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
  JOURNAL_FAKE_DOOR_START_CLICK,
  JOURNAL_FAKE_DOOR_NOT_INTERESTED,
  JOURNAL_FAKE_DOOR_INTERESTED,
  JOURNAL_FAKE_DOOR_CLOSE
} from 'in-services/tracking/tracking';

export const helpfulRCASuggestionTracker = (e: Object) => track(EVENT_RCA_SUGGESTION_HELPFUL, e);
export const unhelpfulRCASuggestionTracker = (e: Object) => track(EVENT_RCA_SUGGESTION_UNHELPFUL, e);
export const expandedRCAEventCardTracker = (e: Object) => track(EVENT_RCA_EXPANDED_CARD, e);
export const RCAFeedbackNextTracker = (e: Object) => track(EVENT_RCA_FEEDBACK_NEXT, e);
export const RCAFeedbackSkipTracker = (e: Object) => track(EVENT_RCA_FEEDBACK_SKIP, e);
export const RCAFeedbackClosedManuallyTracker = (e: Object) => track(EVENT_RCA_FEEDBACK_CLOSED_MANUALLY, e);
export const RCAFeedbackSubmitTracker = (e: Object) => track(EVENT_RCA_FEEDBACK_SUBMIT, e);

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

export const journalStartFakeDoorClickTracker = (e: Object) => track(JOURNAL_FAKE_DOOR_START_CLICK, e);
export const journalFakeDoorNotInterestedTracker = (e: Object) => track(JOURNAL_FAKE_DOOR_NOT_INTERESTED, e);
export const journalFakeDoorInterestedTracker = (e: Object) => track(JOURNAL_FAKE_DOOR_INTERESTED, e);
export const journalFakeDoorCloseTracker = (e: Object) => track(JOURNAL_FAKE_DOOR_CLOSE, e);
