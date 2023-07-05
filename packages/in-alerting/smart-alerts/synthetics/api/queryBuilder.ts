/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { isEmpty } from 'lodash';

import { Observable } from '@instana/observables';

import getTestTagSuggestions from 'in-alerting/smart-alerts/synthetics/subscriptions/getTestTagSuggestions';
import { Result, TagFilterExpressionElementUnion, TagSuggestionProposeType, TimeConfig } from 'in-types';
import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';

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
