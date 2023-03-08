/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { just, Observable } from '@instana/observables';

import { Result, TagFilterExpressionElementUnion, TagSuggestionProposeType, TimeConfig } from 'in-types';
import { success } from 'in-services/util/result';

export interface Suggestions {
  suggestions: string[];
  totalHits: number;
}

export interface GetSuggestionsProps {
  name: string;
  key?: string;
  timeConfig: TimeConfig;
  propose?: TagSuggestionProposeType;
  tagFilterExpression?: TagFilterExpressionElementUnion;
}

/* does not yet fully work */
export function getSuggestions(_props: GetSuggestionsProps): Observable<Result<Suggestions>> {
  const suggestions: Suggestions = {
    suggestions: [],
    totalHits: 0
  };
  return just(success(suggestions));
}
