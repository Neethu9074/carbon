/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  track,
  EVENT_RCA_SUGGESTION_HELPFUL,
  EVENT_RCA_SUGGESTION_UNHELPFUL,
  EVENT_RCA_EXPANDED_CARD
} from 'in-services/tracking/tracking';

export const helpfulRCASuggestionTracker = (e: Object) => track(EVENT_RCA_SUGGESTION_HELPFUL, e);
export const unhelpfulRCASuggestionTracker = (e: Object) => track(EVENT_RCA_SUGGESTION_UNHELPFUL, e);
export const expandedRCAEventCardTracker = (e: Object) => track(EVENT_RCA_EXPANDED_CARD, e);
