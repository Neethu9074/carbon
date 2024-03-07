/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create, Observable } from '@instana/observables';

import memoize, { ObservableCreator } from 'in-services/util/memoizingObservableGenerator';
import { CustomDashboard, CustomDashboardPreview, Result, UserResult } from 'in-types';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { refreshSignalUsers } from 'in-api/usersRefreshSignal';
import http from 'in-services/http';

const refreshSignal = create<string>().emit('');

export const getCustomDashboards = memoize<void, Result<CustomDashboardPreview[]>>(
  getCustomDashboardsInternal,
  () => '',
  60000
);
function getCustomDashboardsInternal() {
  return refreshSignal.flatMap(() =>
    http<CustomDashboardPreview[]>({
      method: 'GET',
      maxRetries: 3,
      url: `/api/custom-dashboard`,
      mapToResultObject: true
    })
  );
}

export const searchCustomDashboards: ObservableCreator<string, Result<CustomDashboardPreview[]>> = memoize<
  string,
  Result<CustomDashboardPreview[]>
>(searchCustomDashboardInternal, query => query, 60000);

function searchCustomDashboardInternal(query: string): Observable<Result<CustomDashboardPreview[]>> {
  return refreshSignal.flatMap(() =>
    http<CustomDashboardPreview[]>({
      method: 'GET',
      maxRetries: 3,
      url: `/api/custom-dashboard?query=${query}`,
      mapToResultObject: true
    })
  );
}

export function addCustomDashboard(customDashboard: CustomDashboard): Observable<Result<CustomDashboard>> {
  return http<CustomDashboard>({
    method: 'POST',
    maxRetries: 3,
    url: `/api/custom-dashboard`,
    headers: getCsrfHeader(),
    data: customDashboard,
    mapToResultObject: true
  }).map(res => {
    if (res.data?.id) {
      refreshSignal.emit(res.data.id);
    }
    return res;
  });
}

export const getCustomDashboard = memoize<string, Result<CustomDashboard>>(
  getCustomDashboardInternal,
  customDashboardId => customDashboardId,
  60000
);
function getCustomDashboardInternal(customDashboardId: string): Observable<Result<CustomDashboard>> {
  return refreshSignal
    .startWith(customDashboardId)
    .filter(id => id === customDashboardId)
    .flatMap(() =>
      http<CustomDashboard>({
        method: 'GET',
        maxRetries: 3,
        url: `/api/custom-dashboard/${encodeURIComponent(customDashboardId)}`,
        headers: getCsrfHeader(),
        mapToResultObject: true
      })
    );
}

export function updateCustomDashboard(customDashboard: CustomDashboard): Observable<Result<CustomDashboard>> {
  return http<CustomDashboard>({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/custom-dashboard/${encodeURIComponent(customDashboard.id)}`,
    headers: getCsrfHeader(),
    data: customDashboard,
    mapToResultObject: true
  }).map(v => {
    refreshSignal.emit(customDashboard.id);
    return v;
  });
}

export function removeCustomDashboard(id: string): Observable<Result<void>> {
  return http<void>({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/custom-dashboard/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    mapToResultObject: true
  }).map(result => {
    refreshSignal.emit(id);
    return result;
  });
}

export const getUsers = memoize<void, Result<UserResult[]>>(getUsersInternal, () => '', 60000);
function getUsersInternal() {
  return refreshSignalUsers.flatMap(() =>
    http<UserResult[]>({
      method: 'GET',
      maxRetries: 3,
      url: `/api/custom-dashboard/shareable-users`,
      mapToResultObject: true
    })
  );
}
