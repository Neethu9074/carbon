import { create } from 'reactive-observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

const refreshCustomPayload = create().emit(true);

function mapAndRefresh(response) {
  refreshCustomPayload.emit(true);
  return response.body;
}

export const getGlobalCustomPayloadAsResultObservable = memoize(
  getGlobalCustomPayloadAsResultObservableInternal,
  () => '',
  60000
);
function getGlobalCustomPayloadAsResultObservableInternal() {
  return refreshCustomPayload.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        url: `/api/events/settings/custom-payload-configurations`,
        maxRetries: 3,
        headers: getCsrfHeader()
      })
    )
  );
}

export function saveGlobalCustomPayload(customPayload) {
  return http({
    method: 'PUT',
    url: `/api/events/settings/custom-payload-configurations`,
    data: customPayload,
    maxRetries: 3,
    headers: getCsrfHeader()
  }).map(mapAndRefresh);
}
