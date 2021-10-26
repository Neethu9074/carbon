/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { deepFreeze } from 'in-services/util/object';
import { SyntheticTest } from 'in-types';
import http from 'in-services/http';

const testsUrl = `/api/synthetics/settings/tests`;

export function getLocations() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/synthetics/settings/locations`,
    mapToResultObject: true
  }).map(response => deepFreeze(response));
}

export function getTests() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: testsUrl,
    mapToResultObject: true
  }).map(response => deepFreeze(response));
}

export function createTest(testConfig: SyntheticTest) {
  return http({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: testsUrl,
    data: testConfig
  }).map(response => deepFreeze(response.body));
}

export function updateTest(testConfig: SyntheticTest) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: testsUrl,
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
