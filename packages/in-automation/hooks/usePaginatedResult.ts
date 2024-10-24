/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get, sortBy } from 'lodash';

import { PaginatedResult, Result } from '@instana/types';

import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { listSuccess } from 'in-services/util/result';

type SortFunction<T> = (entity: T) => any;

interface UsePaginatedResultParams<T> {
  result: Result<T[]> | null | undefined;
  serverTableUrlState: Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>;
  setServerTableUrlState: (
    serverTableUrlState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>
  ) => void;
  searchAttributes: (keyof T | ((entity: T) => string))[];
  sort?: SortFunction<T> | SortFunction<T>[] | keyof T;
}
export default function usePaginatedResult<T>({
  result,
  serverTableUrlState,
  setServerTableUrlState,
  searchAttributes,
  sort = entity => {
    const { orderBy } = serverTableUrlState;
    const value = entity[orderBy as keyof T];
    return typeof value === 'string' ? value.trim().toLowerCase() : value;
  }
}: UsePaginatedResultParams<T>): Result<PaginatedResult<T>> {
  const { page, pageSize, orderDirection, query } = serverTableUrlState;

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
    entities = sortBy(entities, sort);
    if (orderDirection === 'DESC') {
      entities = entities.reverse();
    }
    let offset = (page - 1) * pageSize;
    let until = offset + pageSize;
    const totalHits = entities.length;
    if (offset === totalHits && totalHits !== 0) {
      setServerTableUrlState({ page: page - 1 });
      offset -= pageSize;
      until -= pageSize;
    }
    entities = entities.slice(offset, until);
    return listSuccess(entities, totalHits, pageSize, page);
  }
  return result as unknown as Result<PaginatedResult<T>>;
}
