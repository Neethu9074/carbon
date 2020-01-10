import {
  track,
  APPLICATION_CLICK_CREATE,
  APPLICATION_CLICK_SUBMIT,
  APPLICATION_CLICK_SOURCE_OR_DESTINATION
} from 'in-services/tracking/tracking';

export const applicationOpenSubmitFormTracker = e => track(APPLICATION_CLICK_CREATE, e);
export const applicationSubmitTracker = e => track(APPLICATION_CLICK_SUBMIT, e);
export const applicationSourceOrDestinationTracker = e => track(APPLICATION_CLICK_SOURCE_OR_DESTINATION, e);
