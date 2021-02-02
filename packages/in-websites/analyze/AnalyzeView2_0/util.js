/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import { addTagFilters } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';

export function addDataSourceToBackendQueryModel({ backendQueryModel, dataSource }) {
  return addTagFilters(backendQueryModel, [
    {
      type: 'TAG_FILTER',
      name: 'beacon.type',
      operator: 'EQUALS',
      value: dataSource
    }
  ]);
}
