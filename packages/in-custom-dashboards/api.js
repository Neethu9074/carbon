/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { refreshSignalUsers } from 'in-api/users';
import http from 'in-services/http';

const refreshSignal = create().emit(true);
const refreshSignalSlis = create().emit(true);

export const getCustomDashboards = memoize(getCustomDashboardsInternal, () => '', 60000);
function getCustomDashboardsInternal() {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/custom-dashboard`
      })
    )
  );
}

export function addCustomDashboard(customDashboard) {
  return createObservable(
    http({
      method: 'POST',
      maxRetries: 3,
      url: `/api/custom-dashboard`,
      headers: getCsrfHeader(),
      data: customDashboard
    }).map(res => {
      if (res?.body?.id) {
        refreshSignal.emit(res.body.id);
      }
      return res;
    })
  );
}

export const getCustomDashboard = memoize(getCustomDashboardInternal, customDashboardId => customDashboardId, 60000);
function getCustomDashboardInternal(customDashboardId) {
  return refreshSignal
    .startWith(customDashboardId)
    .filter(id => id === customDashboardId)
    .flatMap(() =>
      createObservable(
        http({
          method: 'GET',
          maxRetries: 3,
          url: `/api/custom-dashboard/${encodeURIComponent(customDashboardId)}`,
          headers: getCsrfHeader()
        })
      )
    );
}

export function updateCustomDashboard(customDashboard) {
  return createObservable(
    http({
      method: 'PUT',
      maxRetries: 3,
      url: `/api/custom-dashboard/${encodeURIComponent(customDashboard.id)}`,
      headers: getCsrfHeader(),
      data: customDashboard
    }).map(v => {
      refreshSignal.emit(customDashboard.id);
      return v;
    })
  );
}

export function removeCustomDashboard(id) {
  return createObservable(
    http({
      method: 'DELETE',
      maxRetries: 3,
      url: `/api/custom-dashboard/${encodeURIComponent(id)}`,
      headers: getCsrfHeader()
    }).map(v => {
      refreshSignal.emit(id);
      return v;
    })
  );
}

export const getUsers = memoize(getUsersInternal, () => '', 60000);
function getUsersInternal() {
  return refreshSignalUsers.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/custom-dashboard/shareable-users`
      })
    )
  );
}

export const getSliConfigurations = memoize(getConfiguredSlis, () => '', 60000);
function getConfiguredSlis() {
  return refreshSignalSlis.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: '/api/settings/sli'
      })
    )
  );
}

export const getSliConfiguration = memoize(getConfiguredSliById, sliConfigId => sliConfigId, 60000);
function getConfiguredSliById(sliConfigId) {
  return refreshSignalSlis.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/sli/${encodeURIComponent(sliConfigId)}`,
        headers: getCsrfHeader()
      })
    )
  );
}

export function createSliConfiguration(sliConfiguration) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: `/api/settings/sli`,
    headers: getCsrfHeader(),
    data: sliConfiguration
  }).map(res => {
    if (res?.body?.id) {
      refreshSignalSlis.emit(res.body.id);
    }
    return res;
  });
}

export function deleteSliConfiguration(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/settings/sli/${encodeURIComponent(id)}`,
    headers: getCsrfHeader()
  }).map(res => {
    refreshSignalSlis.emit(id);
    return res.body;
  });
}
