/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { create } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

const basePath = '/api/events/settings/custom-payload-configurations';

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
        url: basePath,
        maxRetries: 3,
        headers: getCsrfHeader()
      })
    )
  );
}

export function saveGlobalCustomPayload(customPayload) {
  return http({
    method: 'PUT',
    url: basePath,
    data: customPayload,
    maxRetries: 3,
    headers: getCsrfHeader()
  }).map(mapAndRefresh);
}

export function getCustomPayloadTagCatalog() {
  return createObservable(
    http({
      method: 'GET',
      url: `${basePath}/catalog`,
      maxRetries: 3
    })
  );
}
