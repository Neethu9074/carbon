/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { isEmpty } from 'lodash';

import { Observable } from '@instana/observables';

import { TimeConfig, Result, TagSuggestionProposeType, TagFilterExpressionElementUnion } from 'in-types';
import { DEFAULT_MAX_EXPRESSION_DEPTH } from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getTestTagSuggestions from 'in-synthetics/subscriptions/getTestTagSuggestions';
import { createQueryBuilder } from 'in-components/QueryBuilder';
import { getSyntheticTagCatalog } from 'in-synthetics/api';

export interface Suggestions {
  suggestions: string[];
  totalHits: number;
}

export interface GetSuggestionsProps {
  name: string;
  key?: string;
  value?: string;
  timeConfig: TimeConfig;
  propose?: TagSuggestionProposeType;
  tagFilterExpression?: TagFilterExpressionElementUnion;
}

const { QueryBuilder, getTagCatalog: getTagCatalogInternal } = createQueryBuilder({
  maxExpressionDepth: DEFAULT_MAX_EXPRESSION_DEPTH,
  getTagCatalog: props => getSyntheticTagCatalog({ dataSource: 'SYNTHETICS', useCase: 'FILTERING' })(props),
  getSuggestions: args => getTagSuggestions(args, args.timeConfig)
});

export default QueryBuilder;

export function getTagSuggestions(
  args: GetSuggestionsProps,
  suggestionTimeConfig?: TimeConfig
): Observable<Result<Suggestions>> {
  return getSuggestions({
    ...tagSuggestionArgs(args, suggestionTimeConfig)
  });
}

export function getSuggestions({
  name,
  key,
  value,
  timeConfig,
  tagFilterExpression: tfe
}: GetSuggestionsProps): Observable<Result<Suggestions>> {
  const tagFilterExpression = addTagFilters(tfe, []);
  const subscriptionParams = {
    timeConfig,
    tagFilterExpression,
    tagName: name,
    valueFilter: isEmpty(value) ? undefined : value,
    secondLevelKeyTagName: isEmpty(key) ? undefined : key
  };
  return getTestTagSuggestions(subscriptionParams).map(retainGroupNames);
}

function retainGroupNames(result: Result<any>): Result<Suggestions> {
  if (!result.data) {
    return result as Result<Suggestions>;
  }

  return {
    ...result,
    data: {
      suggestions: result.data.suggestions,
      totalHits: result.data.totalHits
    }
  };
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

export const getTagCatalog = getTagCatalogInternal;
