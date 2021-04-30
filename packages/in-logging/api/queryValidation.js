/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

const basePath = '/api/logging-v2/validation';

export const getValidationAsResultObservable = memoize(getValidationAsResultObservableInternal, q => q, 10000);
function getValidationAsResultObservableInternal(data) {
  return createObservable(
    http({
      method: 'POST',
      maxRetries: 3,
      url: basePath,
      headers: getCsrfHeader(),
      data
    })
  );
}
