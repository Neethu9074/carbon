/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Result, TimeConfig, CustomEntityModel } from '@instana/types';
import { Observable } from '@instana/observables';

import { CustomEntityQuery, CustomEntityResult, CustomEntityList } from 'in-infrastructure/CustomEntity/types';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

const customEntitiesAPIBase = '/api/custom-entitytypes';

export function getCustomEntities() {
  return http<CustomEntityResult[]>({
    method: 'GET',
    maxRetries: 3,
    url: customEntitiesAPIBase,
    mapToResultObject: true
  });
}

export function createCustomEntity(data: CustomEntityModel): Observable<Result<CustomEntityModel>> {
  return http<CustomEntityModel>({
    method: 'POST',
    maxRetries: 3,
    url: customEntitiesAPIBase,
    headers: getCsrfHeader(),
    data,
    mapToResultObject: true
  }).map(result => {
    return result;
  });
}

export function getCustomEntityById(entityId: string) {
  return http<CustomEntityResult>({
    method: 'GET',
    maxRetries: 3,
    url: `${customEntitiesAPIBase}/${entityId}`,
    mapToResultObject: true
  });
}

export function getCustomEntitiesInstances(timeConfig: TimeConfig) {
  const data: CustomEntityQuery = {
    timeFrame: timeConfig,
    tagFilterExpression: { type: 'EXPRESSION', logicalOperator: 'AND', elements: [] },
    query: '',
    type: 'openTelemetry',
    order: { by: 'label', direction: 'ASC' },
    pagination: { retrievalSize: 20 }
  };

  return http<CustomEntityList[]>({
    method: 'POST',
    maxRetries: 3,
    url: `${customEntitiesAPIBase}/entities`,
    headers: getCsrfHeader(),
    data,
    mapToResultObject: true
  });
}

export function updateCustomEntity(entityId: string, data: CustomEntityModel): Observable<Result<CustomEntityModel>> {
  return http<CustomEntityModel>({
    method: 'PUT',
    maxRetries: 3,
    url: `${customEntitiesAPIBase}/${entityId}`,
    headers: getCsrfHeader(),
    data,
    mapToResultObject: true
  }).map(result => {
    return result;
  });
}
