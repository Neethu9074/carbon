/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ApdexConfiguration, ApdexConfigurationInput, Result } from '@instana/types';
import { create, Observable } from '@instana/observables';

import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { hasError, isLoading } from 'in-services/util/result';
import { identity } from 'in-services/util/function';
import { minutes } from 'in-services/time';
import http from 'in-services/http';

const refreshSignal = create<number>().emit(0);

export const getAllApdexConfigurations = memoize<void, Result<ApdexConfiguration[]>>(
  () => refreshSignal.flatMap(getAllApdexConfigurationsInternal),
  () => '',
  minutes.toMillis(1)
);
function getAllApdexConfigurationsInternal(): Observable<Result<ApdexConfiguration[]>> {
  return http<ApdexConfiguration[]>({
    method: 'GET',
    url: '/api/settings/apdex',
    maxRetries: 3,
    mapToResultObject: true,
    headers: getCsrfHeader()
  });
}

export const getApdexConfigurationsByEntity = memoize<
  { entityType: ApdexEntityTypes; entityId: string },
  Result<ApdexConfiguration[]>
>(
  ({ entityType, entityId }) =>
    refreshSignal.flatMap(() => getApdexConfigurationsByEntityInternal(entityType, entityId)),
  ({ entityType, entityId }) => `${entityType}-${entityId}`,
  minutes.toMillis(1)
);
function getApdexConfigurationsByEntityInternal(
  entityType: ApdexEntityTypes,
  entityId: string
): Observable<Result<ApdexConfiguration[]>> {
  return http<ApdexConfiguration[]>({
    method: 'GET',
    url: `/api/settings/apdex/${entityType}/${encodeURIComponent(entityId)}`,
    maxRetries: 3,
    mapToResultObject: true,
    headers: getCsrfHeader()
  });
}

export const getApdexConfigurationById = memoize<string, Result<ApdexConfiguration>>(
  id => refreshSignal.flatMap(() => getApdexConfigurationByIdInternal(id)),
  identity,
  minutes.toMillis(1)
);
function getApdexConfigurationByIdInternal(id: string): Observable<Result<ApdexConfiguration>> {
  return http<ApdexConfiguration>({
    method: 'GET',
    url: `/api/settings/apdex/${encodeURIComponent(id)}`,
    maxRetries: 3,
    headers: getCsrfHeader(),
    mapToResultObject: true
  });
}

export function createApdexConfiguration(
  configuration: ApdexConfigurationInput
): Observable<Result<ApdexConfiguration>> {
  return http<ApdexConfiguration>({
    method: 'POST',
    url: '/api/settings/apdex',
    data: configuration,
    treat400AsError: true,
    maxRetries: 3,
    headers: getCsrfHeader(),
    mapToResultObject: true
  }).map(signalRefreshOnSuccess);
}

export function deleteApdexConfiguration(id: string): Observable<Result<void>> {
  return http<void>({
    method: 'DELETE',
    url: `/api/settings/apdex/${encodeURIComponent(id)}`,
    maxRetries: 3,
    headers: getCsrfHeader(),
    mapToResultObject: true
  }).map(signalRefreshOnSuccess);
}

function signalRefreshOnSuccess<T>(result: Result<T>): Result<T> {
  if (!isLoading(result) && !hasError(result)) {
    refreshSignal.emit(1 + Math.random());
  }
  return result;
}
