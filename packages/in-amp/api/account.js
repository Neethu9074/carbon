/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';

import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { ampCompanyInfoEnabled } from 'in-services/featureFlags';
import http from 'in-services/http';

const refreshSignal = create().emit(true);
export function refresh() {
  refreshSignal.emit(true);
}

// observables

export const getAccountAsResultObservable = memoize(getAccountAsResultObservableInternal, () => '', 60000);
function getAccountAsResultObservableInternal() {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/amp/account`
      })
    )
  );
}

export const getReportingTechnologiesAsResultObservable = memoize(
  getReportingTechnologiesAsResultObservableInternal,
  (tenant, unit, to, windowSize, page, pageSize, orderBy, orderDirection) =>
    tenant + unit + orderBy + to + windowSize + page + pageSize + orderDirection,
  60000
);
function getReportingTechnologiesAsResultObservableInternal(
  tenant,
  unit,
  to,
  windowSize,
  page,
  pageSize,
  orderBy,
  orderDirection
) {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/amp/technologies`,
        queryParams: { tenant, unit, to, windowSize, page, pageSize, orderBy, orderDirection }
      })
    )
  );
}

export const getActiveLicensesAsResultObservable = memoize(
  getActiveLicensesAsResultObservableInternal,
  page => page,
  60000
);
function getActiveLicensesAsResultObservableInternal(page, pageSize) {
  return refreshSignal.flatMap(() => createLicenseObservable(page, pageSize, ampCompanyInfoEnabled, 'activeLicenses'));
}

export const getExpiredLicensesAsResultObservable = memoize(
  getExpiredLicensesAsResultObservableInternal,
  page => page,
  60000
);
function getExpiredLicensesAsResultObservableInternal(page, pageSize) {
  return refreshSignal.flatMap(() => createLicenseObservable(page, pageSize, ampCompanyInfoEnabled, 'expiredLicenses'));
}

export const getQueuedLicensesAsResultObservable = memoize(
  getQueuedLicensesAsResultObservableInternal,
  page => page,
  60000
);
function getQueuedLicensesAsResultObservableInternal(page, pageSize) {
  return refreshSignal.flatMap(() => createLicenseObservable(page, pageSize, ampCompanyInfoEnabled, 'queuedLicenses'));
}

export const getQueuedLicensesOfEnvironmentAsResultObservable = memoize(
  getQueuedLicensessOfEnvironmentAsResultObservableInternal,
  page => page,
  60000
);
function getQueuedLicensessOfEnvironmentAsResultObservableInternal(page, pageSize) {
  return refreshSignal.flatMap(() => createLicenseObservable(page, pageSize, false, 'queuedLicenses'));
}

function createLicenseObservable(page, pageSize, getAllEnvironments, type) {
  return createObservable(
    http({
      method: 'GET',
      maxRetries: 3,
      url: `/api/settings/amp/account/${type}`,
      queryParams: { page, pageSize, getAllEnvironments }
    })
  );
}

export const getDataTableAsResultObservable = memoize(getDataTableAsResultObservableInternal, () => '', 60000);
function getDataTableAsResultObservableInternal() {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/amp/dataTable`
      })
    )
  );
}
