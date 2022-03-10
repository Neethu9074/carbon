/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';

import createObservable from 'in-services/http/observableHttpResult';
import http from 'in-services/http';

const refreshSignal = create().emit(true);
export function refresh() {
  refreshSignal.emit(true);
}

export function getConfigAsResultObservable() {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: '/api/settings/export-configuration'
      })
    )
  );
}
