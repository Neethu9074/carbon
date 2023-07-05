/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, TagCatalog, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';

import { getSuggestions, GetSuggestionsProps, Suggestions } from 'in-alerting/smart-alerts/synthetics/api/queryBuilder';
import { createQueryBuilder, CreateQueryBuilderResponse, GetTagCatalogProps } from 'in-components/QueryBuilder';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { getTagCatalog } from 'in-alerting/smart-alerts/synthetics/api/tagCatalog';

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
export function createBoundedAlertQueryBuilder(suggestionTimeConfig?: TimeConfig): CreateQueryBuilderResponse {
  return createQueryBuilder({
    getTagCatalog: () => getTagCatalog({ useCase: 'SMART_ALERTS' }),
    getSuggestions: args => getTagSuggestions(args, suggestionTimeConfig)
  });
}

// The getTagCatalog can be injected for story book
export function createBoundedAlertQueryBuilderFactory(
  getTagCatalogTest: (props: GetTagCatalogProps) => Observable<Result<TagCatalog>>,
  suggestionTimeConfig?: TimeConfig
): CreateQueryBuilderResponse {
  return createQueryBuilder({
    getTagCatalog: getTagCatalogTest,
    getSuggestions: args => getTagSuggestions(args, suggestionTimeConfig)
  });
}

export function getTagSuggestions(
  args: GetSuggestionsProps,
  suggestionTimeConfig?: TimeConfig
): Observable<Result<Suggestions>> {
  return getSuggestions({
    ...tagSuggestionArgs(args, suggestionTimeConfig)
  });
}

function tagSuggestionArgs(args: GetSuggestionsProps, suggestionTimeConfig?: TimeConfig) {
  return {
    ...args,
    tagName: args.name,
    timeConfig: suggestionTimeConfig ?? args.timeConfig,
    secondLevelKeyTagName: args.key,
    value: args.value
  };
}

const queryBuildersByBeaconTypeStatic = {
  defaultQB: createBoundedAlertQueryBuilder()
};

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
export function getQueryBuilder(): CreateQueryBuilderResponse {
  return queryBuildersByBeaconTypeStatic.defaultQB;
}
