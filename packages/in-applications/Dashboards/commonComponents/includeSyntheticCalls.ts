/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { syntheticCallsOptions } from 'in-applications/constants';
import { emptyObject } from 'in-services/fixedObjects';

export function getTagFiltersForSyntheticOption(includeSyntheticOption: string) {
  const filters = [];
  if (includeSyntheticOption === syntheticCallsOptions.exclude) {
    filters.push({ name: 'include_synthetic', value: false, operator: 'EQUALS' });
  } else if (includeSyntheticOption === syntheticCallsOptions.include) {
    filters.push({ name: 'include_synthetic', value: true, operator: 'EQUALS' });
  } else if (includeSyntheticOption === syntheticCallsOptions.only) {
    filters.push({ name: 'include_synthetic', value: true, operator: 'EQUALS' });
    filters.push({ name: 'call.is_synthetic', value: true, operator: 'EQUALS' });
  }
  return filters;
}

export function createFormModelFromSyntheticOption(includeSyntheticOption: string) {
  if (includeSyntheticOption === syntheticCallsOptions.only) {
    return [tagFilter('call.is_synthetic', EQUALS, true)];
  }
  return [];
}

export function createHiddenCallsFromSyntheticOption(includeSyntheticOption: string) {
  if (
    includeSyntheticOption === syntheticCallsOptions.include ||
    includeSyntheticOption === syntheticCallsOptions.only
  ) {
    return { includeSynthetic: true };
  }
  return emptyObject;
}

export function isSyntheticOption(includeSyntheticOption: string): boolean {
  return (
    includeSyntheticOption === syntheticCallsOptions.include || includeSyntheticOption === syntheticCallsOptions.only
  );
}
