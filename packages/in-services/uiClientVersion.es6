import { interval } from 'reactive-observables';

import { createTrackingStore } from 'in-stores/store';
import { track } from 'in-services/tracking/appcues';
import http from 'in-services/http';

export const localTag = window.instana.build.tag;

const timer$ = interval(1000 * 60).flatMap(getServerVersionTag);

export function init() {
  uiNeedsRefresh$.once(() => track('doesUIClientNeedRefresh'));
}

export function getServerVersionTag() {
  return http({
    method: 'GET',
    url: `/build.json`,
    maxRetries: 3
  });
}

export const uiNeedsRefresh$ = createTrackingStore({
  name: 'doesUIClientNeedRefresh',
  observable: timer$.map(result => result.body.tag !== localTag)
}).observable;
