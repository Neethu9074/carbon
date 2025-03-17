/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { NewSavedFilter, Result, SavedFilter } from '@instana/types';
import { create, Observable } from '@instana/observables';

import memoize from 'in-services/util/memoizingObservableGenerator';
import { getHeader } from 'in-services/security/csrf';
import { minutes } from 'in-services/time';
import http from 'in-services/http';

const basePath = '/api/application-monitoring/settings/saved-filter';
export const refreshSignal$ = create<string>().emit('');

export const getSavedFilters = memoize(getSavedFiltersInternal, () => '', minutes.toMillis(10)) as () => Observable<
  Result<SavedFilter[]>
>;

function getSavedFiltersInternal(): Observable<Result<SavedFilter[]>> {
  return refreshSignal$.flatMap(() =>
    http({
      method: 'GET',
      maxRetries: 3,
      url: basePath,
      mapToResultObject: true
    })
  );
}

export function createFilter(filter: NewSavedFilter) {
  return http<SavedFilter>({
    mapToResultObject: true,
    method: 'POST',
    maxRetries: 3,
    url: basePath,
    headers: getHeader(),
    data: filter
  }).map(result => {
    if (result.data) {
      refreshSignal$.emit('');
    }
    return result;
  });
}

export function updateFilter({ filterId, payload }: { filterId: string; payload: SavedFilter }) {
  return http<SavedFilter>({
    mapToResultObject: true,
    method: 'PUT',
    maxRetries: 3,
    url: `${basePath}/${filterId}`,
    headers: getHeader(),
    data: payload
  }).map(result => {
    refreshSignal$.emit('');
    return result;
  });
}

export function deleteFilter(filterId: string) {
  return http({
    mapToResultObject: true,
    method: 'DELETE',
    maxRetries: 3,
    url: `${basePath}/${filterId}`,
    headers: getHeader()
  }).map(result => {
    refreshSignal$.emit('');
    return result;
  });
}
