import {
  track,
  APPLICATION_CLICK_CREATE,
  APPLICATION_CLICK_SUBMIT,
  APPLICATION_CLICK_SOURCE_OR_DESTINATION,
  APPLICATION_LATENCY_JUMP_TO_UNBOUNDED_ANALYTICS
} from 'in-services/tracking/tracking';

export const applicationOpenSubmitFormTracker = e => track(APPLICATION_CLICK_CREATE, e);
export const applicationSubmitTracker = e => track(APPLICATION_CLICK_SUBMIT, e);
export const applicationSourceOrDestinationTracker = e => track(APPLICATION_CLICK_SOURCE_OR_DESTINATION, e);
export const jumpToUnboundedAnalyticsFromLatencyTracker = e =>
  track(APPLICATION_LATENCY_JUMP_TO_UNBOUNDED_ANALYTICS, e);
