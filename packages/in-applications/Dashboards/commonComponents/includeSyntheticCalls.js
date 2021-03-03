/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { syntheticCallsOptions } from 'in-applications/constants';

export function getTagFiltersForSyntheticOption(includeSyntheticOption) {
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

export function isSyntheticOption(includeSyntheticOption) {
  return (
    includeSyntheticOption === syntheticCallsOptions.include || includeSyntheticOption === syntheticCallsOptions.only
  );
}
