/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import HttpResponseStatusCodeError from 'in-services/http/HttpResponseStatusCodeError';
import http from 'in-services/http';

export interface TenantUnit {}

export interface TenantsWithUnits {
  [tenant: string]: TenantUnit[];
}

export function getTenantsWithUnits() {
  return http<TenantsWithUnits>({ method: 'GET', maxRetries: 3, url: '/auth/users/tenants/' }).map(
    response => response.body
  );
}

export function isSignedIn() {
  return http({ method: 'GET', maxRetries: 3, url: '/api/data/', treat400AsError: false, responseType: 'text' }).map(
    response => {
      if (response.status >= 200 && response.status < 300) {
        return true;
      }
      if (response.status === 401 || response.status === 403) {
        return false;
      }
      // Any other 4xx class errors should not be treated as unauthorized and should lead to a reconnection attempt
      throw new HttpResponseStatusCodeError(response, 'GET', '/api/data/');
    }
  );
}
