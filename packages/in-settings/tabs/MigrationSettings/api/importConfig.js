/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';

// import createObservable from 'in-services/http/observableHttpResult';
import http from 'in-services/http';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';

const refreshSignal = create().emit(true);
export function refresh() {
  refreshSignal.emit(true);
}

export function postConfigAsResultObservable(config) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: ' http://localhost:8080/api/settings/import-configuration',
    headers: {
      'Content-Type': 'application/json',
      // accept: 'application/json',
      ...getCsrfHeader()
    },
    data: JSON.stringify(config)
  }).map(v => {
    refreshSignal.emit(config);
    return v;
  });
}
