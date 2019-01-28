import { interval } from 'reactive-observables';

import { createTrackingStore } from 'in-stores/store';
import http from 'in-services/http';
import { build } from 'in-services/config';

export const localTag = build.tag;

const timer$ = interval(1000 * 60).flatMap(getServerVersionTag);

export function init() {
  uiNeedsRefresh$;
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
