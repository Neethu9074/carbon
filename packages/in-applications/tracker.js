import { track, APPLICATION_CLICK_CREATE } from 'in-services/tracking/tracking';

export const applicationCreateClickedTracker = e => track(APPLICATION_CLICK_CREATE, e);
