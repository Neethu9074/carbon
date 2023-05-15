/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Observable } from '@instana/observables';
import { create } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { SyntheticLocation, SyntheticTest } from 'in-types';
import { deepFreeze } from 'in-services/util/object';
import http from 'in-services/http';

const refreshSignal = create().emit(true);
const testsUrl = `/api/synthetics/settings/tests`;
const locationUrl = `/api/synthetics/settings/locations`;
const resultUrl = `/api/synthetics/results`;
const applicationsListUrl = `/api/application-monitoring/settings/application`;

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
    url: locationUrl + '/' + locationId,
    mapToResultObject: true
  }).map(response => deepFreeze(response));
}

export const getLocationsAsResultObservable = memoize(
  getLocationsAsResultObservableInternal,
  (testType: string) => testType,
  1000
);
export function getLocationsAsResultObservableInternal(testType: string) {
  return refreshSignal.flatMap(() =>
    createObservable(
      http<SyntheticLocation[]>({
        method: 'GET',
        maxRetries: 3,
        url: testType === '' ? locationUrl : locationUrl + `?filter={playbackCapabilities.syntheticType=${testType}}`
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
