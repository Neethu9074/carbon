/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';

/**
 * Defines the properties for the useScopeEntityMapping hook.
 *
 * @property {string[]} entityIds - unique id of the entity
 * @property {function} extractId - function to extract the id from the observable data
 * @property {function} extractName - function to extract the name from the observable data
 * @property {Observable} observable - observable to retrieve the data for mapping
 */
interface UseScopeEntityMappingProps<I> {
  entityIds: string[];
  extractId: (entity: I) => string;
  extractName: (entity: I) => string;
  observable: () => Observable<Result<I[]>>;
}

/**
 * This hook creates a id => name mapping for the supplied entity ids like websites.
 * It uses the extractId and extractName functions to obtain the mapping from the given observable.
 *
 * @property {string[]} entityIds - unique id of the entity
 * @property {function} extractId - function to extract the id from the observable data
 * @property {function} extractName - function to extract the name from the observable data
 * @property {Observable} observable - observable to retrieve the data for mapping
 *
 * @returns array of mapped entities with id and name
 */
const useScopeEntityMapping = <I>({ entityIds, extractId, extractName, observable }: UseScopeEntityMappingProps<I>) => {
  const dataTableResult = useObservable(observable, []) ?? pendingResult;
  const loading = isLoading(dataTableResult);
  const hasErrors = hasError(dataTableResult);

  if (!loading && !hasErrors) {
    return dataTableResult.data
      .filter((entity: I) => entityIds?.includes(extractId(entity)))
      .map((entity: I) => {
        return {
          id: extractId(entity),
          name: extractName(entity)
        };
      });
  }

  return [];
};

export default useScopeEntityMapping;
