/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Observable } from '@instana/observables';
import { create } from '@instana/observables';

import {
  Result,
  SyntheticLocation,
  SyntheticTest,
  CatalogUseCase,
  TagCatalog,
  TimeConfig,
  MetricSource
} from 'in-types';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { roundDownToWeek } from 'in-services/util/date';
import { deepFreeze } from 'in-services/util/object';
import { isNotBlank } from 'in-services/util/string';
import http from 'in-services/http';

const refreshSignal = create().emit(true);
const testsUrl = `/api/synthetics/settings/tests`;
const locationUrl = `/api/synthetics/settings/locations`;
const resultUrl = `/api/synthetics/results`;
const applicationsListUrl = `/api/application-monitoring/settings/application`;
const tagCatalogUrl = `/api/synthetics/catalog`;

export function getLocations(): Observable<unknown> {
  return http({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: locationUrl,
    mapToResultObject: true
  }).map(response => deepFreeze(response));
}

export function getLocation(locationId: string): Observable<unknown> {
  return http({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: locationUrl + '/' + locationId,
    mapToResultObject: true
  }).map(response => deepFreeze(response));
}

export function deleteLocation(locationId: string): Observable<unknown> {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: locationUrl + '/' + locationId
  }).map(response => deepFreeze(response));
}

export const getLocationsAsResultObservable: (
  testType: string,
  locationType?: string
) => Observable<Result<SyntheticLocation[]> | null> = memoize(
  getLocationsAsResultObservableInternal,
  (testType: string, locationType?: string) => (locationType ? testType + locationType : testType),
  2000
);
export function getLocationsAsResultObservableInternal(testType: string, locationType?: string) {
  const filters: string[] = [];
  if (isNotBlank(testType)) {
    filters.push(`filter={playbackCapabilities.syntheticType=${testType}}`);
  }
  if (isNotBlank(locationType)) {
    filters.push(`filter={locationType=${locationType}}`);
  }

  return refreshSignal.flatMap(() =>
    createObservable(
      http<SyntheticLocation[]>({
        method: 'GET',
        maxRetries: 3,
        url: filters.length > 0 ? locationUrl + `?${filters.join('&')}` : locationUrl
      }).map(response => deepFreeze(response))
    ).startWith(null)
  );
}

export const getTestsAsResultObservable = memoize(getTestsAsResultObservableInternal, () => '', 1000);
export function getTestsAsResultObservableInternal() {
  return refreshSignal.flatMap(() =>
    createObservable(
      http<SyntheticTest[]>({
        method: 'GET',
        maxRetries: 3,
        url: testsUrl
      }).map(response => deepFreeze(response))
    ).startWith(null)
  );
}

//This function is used in Synthetic RBAC Limited Access Scope
export function getSyntheticTestsAsResult(): Observable<Result<SyntheticTest[]>> {
  return http<SyntheticTest[]>({
    method: 'GET',
    maxRetries: 3,
    url: testsUrl,
    mapToResultObject: true
  });
}

export function getTests(): Observable<unknown> {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: testsUrl,
    mapToResultObject: true
  }).map(response => deepFreeze(response));
}

export function getTest(testId: string): Observable<unknown> {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: testsUrl + '/' + testId,
    mapToResultObject: true
  }).map(response => deepFreeze(response));
}

export function getTestResultMetadata(testId: string, testResultId: string): Observable<unknown> {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: resultUrl + '/' + testId + '/' + testResultId,
    mapToResultObject: true
  }).map(response => deepFreeze(response));
}
export function createTest(testConfig: SyntheticTest): Observable<unknown> {
  return http({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: testsUrl,
    data: testConfig
  }).map(response => deepFreeze(response.body));
}

export function updateTest(testConfig: SyntheticTest): Observable<unknown> {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${testsUrl}/${testConfig.id}`,
    data: testConfig
  }).map(response => deepFreeze(response.body));
}

export function removeTest(id: string) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${testsUrl}/${id}`
  }).map(response => deepFreeze(response));
}

export function getApplicationsList(): Observable<unknown> {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: applicationsListUrl,
    mapToResultObject: true
  }).map(response => deepFreeze(response));
}

export const getSyntheticTagCatalog =
  ({ dataSource, useCase }: { dataSource: MetricSource; useCase: CatalogUseCase }) =>
  ({ timeConfig }: { timeConfig: TimeConfig }): Observable<Result<TagCatalog>> => {
    // round down the from timestamp to the beginning of the week to make the caching more efficient
    const from = timeConfig ? roundDownToWeek((timeConfig.to || Date.now()) - timeConfig.windowSize) : undefined;

    return http<TagCatalog>({
      method: 'GET',
      maxRetries: 3,
      url: tagCatalogUrl,
      mapToResultObject: true,
      queryParams: {
        from,
        dataSource,
        useCase
      }
    }).map(response => deepFreeze(response));
  };
