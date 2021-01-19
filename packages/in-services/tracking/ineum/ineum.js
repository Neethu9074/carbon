/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerTracker } from 'in-services/tracking/trackers';

export function init() {
  registerTracker(track);
}

export function ineum() {
  if (typeof window !== 'undefined' && window.ineum) {
    window.ineum.apply(window, arguments);
  }
}

function track(event, meta) {
  ineum('reportEvent', event, { meta });
}
