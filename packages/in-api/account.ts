/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import HttpResponseStatusCodeError from 'in-services/http/HttpResponseStatusCodeError';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { minutes } from 'in-services/time';
import http from 'in-services/http';

export interface TenantUnit {}

export interface TenantsWithUnits {
  [tenant: string]: TenantUnit[];
}

// follow the patterns of caching in other areas, without a parameter for any id
export function getTenantsWithUnitsInternal() {
  return http<TenantsWithUnits>({ method: 'GET', maxRetries: 3, url: '/api/settings/rbac/user/tenants/' }).map(
    response => response.body
  );
}
export const getTenantsWithUnits = getTenantsWithUnitsInternal;

// follow the patterns of caching in other areas. Here, without a parameter for any id
// be careful: only deletes itself and cached value
// after all observers had been disposed!
const memoizedGetTenantsWithUnits = memoize(getTenantsWithUnitsInternal, () => 'TenantUnits', minutes.toMillis(10));

// always returns a cached observable
export const getTenantsWithUnitsCached = () => memoizedGetTenantsWithUnits(0 /*unused*/);

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
