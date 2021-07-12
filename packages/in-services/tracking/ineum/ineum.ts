/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerTracker } from 'in-services/tracking/trackers';

export function init() {
  registerTracker(track);
}

export const ineum: typeof window.ineum = (function() {
  if (typeof window !== 'undefined' && window.ineum) {
    // @ts-ignore
    window.ineum.apply(window, arguments);
  }
} as any);

function track(event: string, meta?: {}) {
  ineum('reportEvent', event, { meta });
}
