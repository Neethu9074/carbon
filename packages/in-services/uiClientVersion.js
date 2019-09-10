import { interval } from 'reactive-observables';

import { createTrackingStore } from 'in-stores/store';
import { build } from 'in-services/config';
import http from 'in-services/http';

export const localTag = build.tag;

const timer$ = interval(1000 * 60)
  .flatMap(getServerVersionTag)
  .map(result => result.data)
  .filter(Boolean);

export function getServerVersionTag() {
  return http({
    method: 'GET',
    url: `/build.json`,
    maxRetries: 3,
    mapToResultObject: true,
    queryParams: {
      noCache: Date.now()
    }
  });
}

export const uiNeedsRefresh$ = createTrackingStore({
  name: 'doesUIClientNeedRefresh',
  observable: timer$.map(result => result.body.tag !== localTag)
}).observable;
