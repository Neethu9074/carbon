/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { create } from '@instana/observables';

import { NewSubtraceConfig, SubtraceConfig } from 'in-applications/types';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { Subtrace } from 'in-applications/lists/SubtracesList';
import http from 'in-services/http';

const basePath = '/api/application-monitoring/settings/subtrace';
const refreshSignal$ = create<string>().emit('');

export const getSubtraces = () => {
  return refreshSignal$.flatMap(() =>
    http<Subtrace[]>({
      method: 'GET',
      maxRetries: 3,
      url: basePath,
      mapToResultObject: true
    })
  );
};

export const createSubtrace = (subtrace: NewSubtraceConfig) => {
  return http<Subtrace>({
    method: 'POST',
    maxRetries: 3,
    url: basePath,
    headers: getCsrfHeader(),
    data: subtrace,
    mapToResultObject: true
  }).map(result => {
    if (result.data?.id) refreshSignal$.emit(result.data.id);
    return result;
  });
};

export const updateSubtrace = (subtrace: SubtraceConfig) => {
  const id = subtrace.id;
  return http<Subtrace>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${basePath}/${id}`,
    data: subtrace,
    mapToResultObject: true
  });
};

export const deleteSubtrace = (subtraceId: string) => {
  return http<Subtrace>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${basePath}/${subtraceId}`,
    mapToResultObject: true
  });
};
