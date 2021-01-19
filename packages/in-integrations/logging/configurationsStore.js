/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { create } from '@instana/observables';

import { get } from 'in-integrations/logging/api';
import { hours } from 'in-services/time';

const refreshSignal$ = create();
const integrations$ = refreshSignal$
  .startWith(true)
  .flatMap(get)
  // Do not refrequently re-subscribe because this creates excessive requests to our API.
  .delayedStop(hours.toMillis(1));

export function refresh() {
  refreshSignal$.emit(true);
}

export function getIntegrationConfiguration(type) {
  return integrations$.map(integrations => integrations.find(i => i.type === type));
}
