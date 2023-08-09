/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, TagCatalog, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';

import { createQueryBuilder, CreateQueryBuilderResponse } from 'in-components/QueryBuilder';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { successObservable } from 'in-services/util/result';

/**
 * Creates a QueryBuilder that is bound to a single ?Synthetic Test?, use-case and beacon-type.
 * Consequently, the suggestions shown are only part of that limited scope.
 *
 * This extends the beacon-type specific QueryBuilders by an additional
 * tagFilterExpression for the suggestions
 *
 * @param suggestionTimeConfig optional, the timeframe used for resolving tag-suggestions.
 *
 * @returns A QueryBuilder
 */
export function CreateBoundedAlertQueryBuilder(tagCatalog: TagCatalog): CreateQueryBuilderResponse {
  return createQueryBuilder({
    getTagCatalog: () => successObservable(tagCatalog)
  });
}

/** helper, to create a query-builder dependent query validator */

type isQueryValidType = (tagFilterFormModel: FormModelElement[], timeConfig: TimeConfig) => Observable<Result<Boolean>>;
type TagFilterTimeConfigTuple = [FormModelElement[], TimeConfig];
export const createIsAlertQueryValid = (isQueryValid: isQueryValidType) => {
  return ([tagFilterFormModel, timeConfig]: TagFilterTimeConfigTuple) => {
    return isQueryValid(tagFilterFormModel, timeConfig);
  };
};

/**
 * It can be used for accessing the tagCatalog and do a query validation.
 */
export function getQueryBuilder(tagCatalog: TagCatalog): CreateQueryBuilderResponse {
  return CreateBoundedAlertQueryBuilder(tagCatalog);
}
