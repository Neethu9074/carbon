/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

const refreshSignal = create().emit(true);
export function refresh() {
  refreshSignal.emit(true);
}

export interface ConfigJSON {
  applicationConfigs?: any;
}

export function postConfigAsResultObservable(config: ConfigJSON) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: '/api/settings/import-configuration',
    headers: getCsrfHeader(),
    data: config
  }).map(v => {
    refreshSignal.emit(config);
    return v;
  });
}
