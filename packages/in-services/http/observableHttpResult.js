/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { combineLatest } from '@instana/observables';

import { deepFreeze } from 'in-services/util/object';

export default function createObservable(observableHttpRequest) {
  const observable = combineLatest([
    observableHttpRequest.startWith(null),
    observableHttpRequest.errors().startWith(null)
  ]).map(([response, error]) => {
    return deepFreeze({
      data: response ? response.body : null,
      errors: getErrors(error),
      progress: {
        loading: !response && !error
      },
      time: Date.now()
    });
  });

  return observable;
}

function mapResponseStatusCode(statusCode) {
  if (statusCode === 403 || statusCode === 401) {
    return 'AUTH';
  }
  if (statusCode === 412) {
    return 'VALIDATION';
  }
  if (statusCode === 404) {
    return 'NOT_FOUND';
  }
  if (statusCode === 504) {
    return 'TIMEOUT';
  }
  if (statusCode >= 400 && statusCode < 500) {
    return 'CLIENT';
  }
  return 'SERVER';
}

// export for test
export function getErrors(error) {
  if (!error) {
    return [];
  }
  if (error.message) {
    return [{ code: mapResponseStatusCode(error?.response?.status), message: error.message }];
  }
  if (error.response) {
    return [{ code: mapResponseStatusCode(error.response.status), message: error.response.statusText }];
  }
  if (Array.isArray(error)) {
    return error
      .map(error => (typeof error === 'string' ? { code: 'SERVER', message: error } : undefined))
      .filter(Boolean);
  }
  return [];
}
