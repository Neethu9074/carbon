/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get, sortBy } from 'lodash';

import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { Nullish, PaginatedResult, Result } from 'in-types';
import { listSuccess } from 'in-services/util/result';

export default function usePaginatedResult<T>(
  result: Result<T[]> | Nullish,
  serverTableUrlState: Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>,
  searchAttributes: (keyof T | ((entity: T) => string))[]
): Result<PaginatedResult<T>> {
  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;

  if (result?.data) {
    let entities = result.data;
    entities = entities.filter(entity => {
      if (query) {
        return searchAttributes.some(searchAttribute => {
          const value: string =
            typeof searchAttribute === 'function' ? searchAttribute(entity) : get(entity, searchAttribute);
          return value?.toLowerCase().includes(query.toLowerCase());
        });
      }
      return true;
    });
    const caseInsensitiveSortIteratee = (entity: T) => {
      const value = entity[orderBy as keyof T];
      return typeof value === 'string' ? value.trim().toLowerCase() : value;
    };

    entities = sortBy(entities, caseInsensitiveSortIteratee);
    if (orderDirection === 'DESC') {
      entities = entities.reverse();
    }
    const offset = (page - 1) * pageSize;
    const until = offset + pageSize;
    const totalHits = entities.length;
    entities = entities.slice(offset, until);
    return listSuccess(entities, totalHits, pageSize, page);
  }
  return result as unknown as Result<PaginatedResult<T>>;
}
