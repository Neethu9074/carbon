/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  OrderDirection,
  PaginatedResult,
  Result,
  ServiceLevelObjectiveConfiguration,
  SloEntityType
} from '@instana/types';
import { create, just, Observable } from '@instana/observables';
import { generateStableHash } from '@instana/utils';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { isBlank } from 'in-services/util/string';
import { error } from 'in-services/util/result';
import { minutes } from 'in-services/time';
import http from 'in-services/http';

const refreshSignal = create<string>().emit('');

export interface GetAllSloConfigurationsArguments {
  ids?: string[];
  page?: number;
  pageSize?: number;
  query?: string;
  tags?: string[];
  entityType?: SloEntityType;
  orderBy?: string;
  orderDirection?: OrderDirection;
}

function getAllSloConfigurationsInternal({
  ids,
  page = 1,
  pageSize = 20,
  orderDirection = 'ASC',
  tags,
  query,
  entityType,
  orderBy
}: GetAllSloConfigurationsArguments = {}) {
  return refreshSignal.flatMap(() =>
    http<PaginatedResult<ServiceLevelObjectiveConfiguration>>({
      method: 'GET',
      maxRetries: 3,
      url: '/api/settings/slo',
      mapToResultObject: true,
      queryParams: {
        sloIds: ids,
        page,
        pageSize,
        orderDirection,
        tag: tags,
        query,
        entityType,
        orderBy
      }
    })
  );
}

export const getAllSloConfigurations = memoize<
  GetAllSloConfigurationsArguments,
  Result<PaginatedResult<ServiceLevelObjectiveConfiguration>>
>(getAllSloConfigurationsInternal, args => generateStableHash(args), minutes.toMillis(1));

function getSloTagsInternal() {
  return refreshSignal.flatMap(() =>
    http<string[]>({
      method: 'GET',
      maxRetries: 3,
      url: '/api/settings/slo/tags',
      mapToResultObject: true
    })
  );
}

export const getSloTags = memoize<void, Result<string[]>>(getSloTagsInternal, () => '', minutes.toMillis(1));

function getSloConfigurationInternal(id: string) {
  return refreshSignal.flatMap(() =>
    http<ServiceLevelObjectiveConfiguration>({
      method: 'GET',
      maxRetries: 3,
      url: `/api/settings/slo/${encodeURIComponent(id)}`,
      mapToResultObject: true
    })
  );
}
export const getSloConfiguration = memoize<string, Result<ServiceLevelObjectiveConfiguration>>(
  getSloConfigurationInternal,
  id => id,
  minutes.toMillis(1)
);

function getSloConfigurationsInternal(ids: string[]) {
  return getAllSloConfigurationsInternal({ ids, pageSize: ids.length });
}

export const getSloConfigurations = memoize<string[], Result<PaginatedResult<ServiceLevelObjectiveConfiguration>>>(
  getSloConfigurationsInternal,
  ids => generateStableHash(ids),
  minutes.toMillis(1)
);

export function createSloConfiguration(
  sloConfig: ServiceLevelObjectiveConfiguration
): Observable<Result<ServiceLevelObjectiveConfiguration>> {
  return http<ServiceLevelObjectiveConfiguration>({
    method: 'POST',
    maxRetries: 3,
    url: `/api/settings/slo`,
    headers: getCsrfHeader(),
    data: sloConfig,
    treat400AsError: true,
    mapToResultObject: true
  }).map(res => {
    if (res?.data?.id) refreshSignal.emit(res.data.id);

    return res;
  });
}

export function updateSloConfiguration(
  sloConfig: ServiceLevelObjectiveConfiguration
): Observable<Result<ServiceLevelObjectiveConfiguration>> {
  const { id } = sloConfig;

  if (isBlank(id) || id === undefined) {
    return just(error([{ code: 'CLIENT', message: 'Configuration ID cannot be blank' }]));
  }

  return http<ServiceLevelObjectiveConfiguration>({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/settings/slo/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    data: sloConfig,
    treat400AsError: true,
    mapToResultObject: true
  }).map(res => {
    if (res?.data?.id) refreshSignal.emit(res.data.id);

    return res;
  });
}

export function deleteSloConfiguration(id: string): Observable<true> {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/settings/slo/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    treat400AsError: true
  }).map(() => {
    refreshSignal.emit(id);
    return true;
  });
}
