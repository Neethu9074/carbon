/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { interval } from '@instana/observables';

import { createTrackingStore } from 'in-stores/store';
import { build } from 'in-services/config';
import { minutes } from 'in-services/time';
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
  observable: interval(minutes.toMillis(1))
    .flatMap(getServerVersionTag)
    .filter(result => result.data)
    .map(result => result.data.tag !== localTag)
}).observable;
