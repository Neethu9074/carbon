/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create, Observable } from '@instana/observables';

import {
  CustomDashboardPreview,
  CustomDashboard,
  Result,
  SliConfiguration,
  SliConfigurationWithLastUpdated,
  UserResult
} from 'in-types';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { refreshSignalUsers } from 'in-api/usersRefreshSignal';
import http, { Response } from 'in-services/http';

const refreshSignal = create<string>().emit('');
const refreshSignalSlis = create<string>().emit('');

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

export const getSliConfigurations = memoize<void, Result<SliConfigurationWithLastUpdated[]>>(
  getConfiguredSlis,
  () => '',
  60000
);
function getConfiguredSlis() {
  return refreshSignalSlis.flatMap(() =>
    http<SliConfigurationWithLastUpdated[]>({
      method: 'GET',
      maxRetries: 3,
      url: '/api/settings/sli',
      mapToResultObject: true
    })
  );
}

export const getSliConfiguration = memoize<string, Result<SliConfigurationWithLastUpdated>>(
  getConfiguredSliById,
  sliConfigId => sliConfigId,
  60000
);
function getConfiguredSliById(sliConfigId: string) {
  return refreshSignalSlis.flatMap(() =>
    http<SliConfigurationWithLastUpdated>({
      method: 'GET',
      maxRetries: 3,
      url: `/api/settings/sli/${encodeURIComponent(sliConfigId)}`,
      headers: getCsrfHeader(),
      mapToResultObject: true
    })
  );
}

export function createSliConfiguration(
  sliConfiguration: SliConfiguration
): Observable<Response<SliConfigurationWithLastUpdated>> {
  return http<SliConfigurationWithLastUpdated>({
    method: 'POST',
    maxRetries: 3,
    url: `/api/settings/sli`,
    headers: getCsrfHeader(),
    data: sliConfiguration
  }).map(res => {
    if (res.body?.id) {
      refreshSignalSlis.emit(res.body.id);
    }
    return res;
  });
}

export function deleteSliConfiguration(id: string): Observable<true> {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/settings/sli/${encodeURIComponent(id)}`,
    headers: getCsrfHeader()
  }).map(() => {
    refreshSignalSlis.emit(id);
    return true;
  });
}
