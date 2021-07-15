/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import http from 'in-services/http';

interface TenantUnit {}

interface TenantsWithUnits {
  [tenant: string]: TenantUnit[];
}

export function getTenantsWithUnits() {
  return http<TenantsWithUnits>({ method: 'GET', maxRetries: 3, url: '/auth/users/tenants/' }).map(
    response => response.body
  );
}

export function isSignedIn() {
  return http({ method: 'GET', maxRetries: 3, url: '/api/data/', treat400AsError: false, responseType: 'text' }).map(
    response => response.status >= 200 && response.status < 300
  );
}
