import { interval } from 'reactive-observables';

import { createTrackingStore } from 'in-stores/store';
import { build } from 'in-services/config';
import http from 'in-services/http';

export const localTag = build.tag;

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
  observable: interval(1000 * 60)
    .flatMap(getServerVersionTag)
    .filter(result => result.data)
    .map(result => result.data.tag !== localTag)
}).observable;
