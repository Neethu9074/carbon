/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Result, ThresholdType, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';

import { GetSuggestionsProps, Suggestions } from 'in-websites/queryBuilder';
import { CreateQueryBuilderResponse } from 'in-components/QueryBuilder';
import { BeaconType, Nullish } from 'in-types';

export function createBoundedAlertQueryBuilder(
  websiteId: string,
  beaconType: BeaconType | Nullish,
  thresholdType?: ThresholdType,
  suggestionTimeConfig?: TimeConfig
): CreateQueryBuilderResponse;

export function getWebsiteTagSuggestions(
  args: GetSuggestionsProps,
  websiteId?: string | Nullish,
  beaconType: BeaconType,
  suggestionTimeConfig?: TimeConfig
): Observable<Result<Suggestions>>;

export function getQueryBuilderForBeaconType(
  beaconType: BeaconType | Nullish,
  thresholdType?: ThresholdType
): CreateQueryBuilderResponse;
