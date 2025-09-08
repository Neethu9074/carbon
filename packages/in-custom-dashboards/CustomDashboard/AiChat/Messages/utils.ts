/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { CommonFinalConfig, CommonInferredConfig } from 'in-custom-dashboards/CustomDashboard/AiChat/types';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { DESTINATION, NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';

export function toInputConfig(finalConfigState: CommonInferredConfig): CommonFinalConfig {
  const getEntity = (filterName: string) =>
    filterName === 'call.erroneous' || filterName === 'call.type' ? NOT_APPLICABLE : DESTINATION;
  const createTagFilter = (filterName: string, filterValue: string) =>
    tagFilter(filterName, EQUALS, filterValue, null, getEntity(filterName));
  const tagFilters = Object.entries(finalConfigState.filter!).map(([filterName, filterValue]) =>
    createTagFilter(filterName, filterValue)
  );
  return { ...finalConfigState, tagFilterExpression: toBackendQueryModel(tagFilters) } as CommonFinalConfig;
}
