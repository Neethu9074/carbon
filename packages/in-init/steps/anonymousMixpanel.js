/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerTracker } from 'in-services/tracking/trackers';

export function init() {
  if (window.mixpanel) {
    initMixpanel();
    registerTracker(track);
  }
}

function initMixpanel() {
  // not calling mixpanel.identify(someUserId) will result in mixpanel creating some default, cookie base id
}

function track(event, props) {
  window.mixpanel.track(event, props);
}
