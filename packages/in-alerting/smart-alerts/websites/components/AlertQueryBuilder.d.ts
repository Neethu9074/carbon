/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Result, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';

import { GetSuggestionsProps, Suggestions } from 'in-websites/queryBuilder';
import { BeaconType } from 'in-types';

export function getWebsiteTagSuggestions(
  args: GetSuggestionsProps,
  websiteId: string,
  beaconType: BeaconType,
  suggestionTimeConfig?: TimeConfig
): Observable<Result<Suggestions>>;
