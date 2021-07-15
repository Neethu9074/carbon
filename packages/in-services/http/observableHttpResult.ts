/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest, Observable } from '@instana/observables';
import { ErrorCode, Error } from 'in-types/backend';
import { Response } from 'in-services/http/types';

import { loading, success, error as createErrorObject } from 'in-services/util/result';

export default function createObservable<T>(observableHttpRequest: Observable<Response<T>>) {
  const observable = combineLatest([
    observableHttpRequest.startWith(null),
    observableHttpRequest.errors().startWith(null)
  ], true).map(parts => {
    const response: Response<T> | null = parts[0];
    const errors = getErrors(parts[1]);
    const hasErrors = errors.length > 0;

    if (!response && !hasErrors) {
      return loading;
    }

    if (hasErrors) {
      return createErrorObject(errors);
    }

    return success(response?.body ?? null);
  });

  return observable;
}

function mapResponseStatusCode(statusCode: number): ErrorCode {
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
export function getErrors(error: any): Error[] {
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
      .filter(error => typeof error === 'string')
      .map(error => ({ code: 'SERVER', message: error }));
  }
  return [];
}
