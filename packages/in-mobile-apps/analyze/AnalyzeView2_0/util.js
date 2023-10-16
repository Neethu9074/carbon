/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { addTagFilters, OPERATOR_AND } from 'in-components/QueryBuilder/transformation/backendQueryModel';

export function addDataSourceToBackendQueryModel({ backendQueryModel, dataSource }) {
  return addTagFilters(
    backendQueryModel,
    [
      {
        type: 'TAG_FILTER',
        name: 'mobileBeacon.type',
        operator: 'EQUALS',
        value: dataSource
      }
    ],
    OPERATOR_AND,
    true
  );
}
