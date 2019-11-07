/* global __HOT_RELOAD__: false */

import { registerTracker } from 'in-services/tracking/trackers';

const mixpanel = window.mixpanel;

export function init() {
  if (mixpanel) {
    initMixpanel();
    registerTracker(track);
  }
}

function initMixpanel() {
  // not calling mixpanel.identify(someUserId) will result in mixpanel creating some default, cookie base id
}

function track(event, props) {
  mixpanel.track(event, props);
}
