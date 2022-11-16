/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Result, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';

import { ApplicationBoundaryScope, ApplicationNode } from 'in-types';
import { GetTagSuggestionsProps } from 'in-components/QueryBuilder';

export function getApplicationTagSuggestions(
  args: GetTagSuggestionsProps,
  suggestionTimeConfig?: TimeConfig,
  applications: Record<string, ApplicationNode>,
  boundaryScope: ApplicationBoundaryScope
): Observable<Result<TagSuggestions>>;
