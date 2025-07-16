/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  OrderDirection,
  PaginatedResult,
  Result,
  TimeConfig,
  CorrectionConfiguration,
  Correction
} from '@instana/types';
import { create, just, Observable } from '@instana/observables';
import { generateStableHash } from '@instana/utils';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { isBlank } from 'in-services/util/string';
import { error } from 'in-services/util/result';
import { minutes } from 'in-services/time';
import http from 'in-services/http';

export const refreshSignal = create<string>().emit('');

const correctionConfigurationUrl = '/api/settings/correction' as const;
export interface GetAllCorrectionConfigurationsArguments {
  ids?: string[];
  page?: number;
  pageSize?: number;
  query?: string;
  sloId?: string;
  orderBy?: string;
  orderDirection?: OrderDirection;
}

function getAllCorrectionConfigurationsInternal({
  ids,
  page,
  pageSize,
  orderDirection,
  query,
  sloId,
  orderBy
}: GetAllCorrectionConfigurationsArguments = {}): Observable<Result<PaginatedResult<CorrectionConfiguration>>> {
  return refreshSignal.flatMap(() =>
    http<PaginatedResult<CorrectionConfiguration>>({
      method: 'GET',
      maxRetries: 3,
      url: correctionConfigurationUrl,
      mapToResultObject: true,
      queryParams: {
        sloId,
        page,
        pageSize,
        orderDirection,
        query,
        ids,
        orderBy
      }
    })
  );
}

export const getAllCorrectionConfiguration = memoize<
  GetAllCorrectionConfigurationsArguments,
  Result<PaginatedResult<CorrectionConfiguration>>
>(getAllCorrectionConfigurationsInternal, args => generateStableHash(args), minutes.toMillis(1));

function getCorrectionConfigurationInternal(id: string) {
  return refreshSignal.flatMap(() =>
    http<CorrectionConfiguration>({
      method: 'GET',
      maxRetries: 3,
      url: `${correctionConfigurationUrl}/${encodeURIComponent(id)}`,
      mapToResultObject: true
    })
  );
}

export const getCorrectionConfiguration = memoize<string, Result<CorrectionConfiguration>>(
  getCorrectionConfigurationInternal,
  id => id,
  minutes.toMillis(1)
);

export function createCorrectionConfiguration(
  correctionConfiguration: CorrectionConfiguration
): Observable<Result<CorrectionConfiguration>> {
  return http<CorrectionConfiguration>({
    method: 'POST',
    maxRetries: 3,
    url: correctionConfigurationUrl,
    headers: getCsrfHeader(),
    data: correctionConfiguration,
    treat400AsError: true,
    mapToResultObject: true
  }).map(res => {
    if (res?.data?.id) refreshSignal.emit(res.data.id);

    return res;
  });
}

export function updateCorrectionConfiguration(
  correctionConfiguration: CorrectionConfiguration
): Observable<Result<CorrectionConfiguration>> {
  const { id } = correctionConfiguration;

  if (isBlank(id) || id === undefined) {
    return just(error([{ code: 'CLIENT', message: 'Configuration ID cannot be blank' }]));
  }

  return http<CorrectionConfiguration>({
    method: 'PUT',
    maxRetries: 3,
    url: `${correctionConfigurationUrl}/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    data: correctionConfiguration,
    treat400AsError: true,
    mapToResultObject: true
  }).map(res => {
    if (res?.data?.id) refreshSignal.emit(res.data.id);

    return res;
  });
}

export function deleteCorrectionConfiguration(id: string): Observable<true> {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `${correctionConfigurationUrl}/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    treat400AsError: true
  }).map(() => {
    refreshSignal.emit(id);
    return true;
  });
}

export interface GetCorrectionWindowsArguments {
  sloConfigId?: string;
  timeConfig: TimeConfig;
}

export function getCorrectionWindowsInternal({
  sloConfigId,
  timeConfig
}: GetCorrectionWindowsArguments): Observable<Result<Correction>> {
  if (isBlank(sloConfigId) || sloConfigId === undefined) {
    return just(error([{ code: 'CLIENT', message: 'Configuration ID cannot be blank' }]));
  }

  const to = timeConfig.to ?? Date.now();
  return refreshSignal.flatMap(() =>
    http<Correction>({
      method: 'GET',
      maxRetries: 3,
      url: '/api/slo/correction',
      mapToResultObject: true,
      queryParams: {
        sloId: sloConfigId,
        from: to - timeConfig.windowSize,
        to
      }
    })
  );
}

export const getCorrectionWindows = memoize<GetCorrectionWindowsArguments, Result<Correction>>(
  getCorrectionWindowsInternal,
  args => generateStableHash(args),
  minutes.toMillis(1)
);
