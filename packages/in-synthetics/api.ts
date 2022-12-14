/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Observable } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { deepFreeze } from 'in-services/util/object';
import { SyntheticTest } from 'in-types';
import http from 'in-services/http';

const testsUrl = `/api/synthetics/settings/tests`;
const locationUrl = `/api/synthetics/settings/locations`;
const resultUrl = `/api/synthetics/results`;

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
