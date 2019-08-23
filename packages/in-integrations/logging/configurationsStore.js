import { create } from 'reactive-observables';

import { get } from 'in-integrations/logging/api';

const refreshSignal$ = create();
const integrations$ = refreshSignal$
  .startWith(true)
  .flatMap(get)
  // Do not refrequently re-subscribe because this creates excessive requests to our API.
  .delayedStop(1000 * 60 * 60);

export function refresh() {
  refreshSignal$.emit(true);
}

export function getIntegrationConfiguration(name) {
  return integrations$.map(integrations => integrations.find(i => i.name === name));
}
