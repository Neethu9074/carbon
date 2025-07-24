/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import {
  Result,
  TagSuggestions,
  ThresholdType,
  TimeConfig,
  ApplicationBoundaryScope,
  ApplicationNode
} from '@instana/types';
import { Observable } from '@instana/observables';

import { ApplicationAlertType } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { CreateQueryBuilderResponse, GetTagSuggestionsProps } from 'in-components/QueryBuilder';
import { Nullish } from 'in-types';

export function createBoundedAlertQueryBuilder(
  applications: Record<string, ApplicationNode>,
  boundaryScope: ApplicationBoundaryScope,
  suggestionTimeConfig?: number,
  thresholdType?: ThresholdType,
  ruleType?: ApplicationAlertType
): CreateQueryBuilderResponse;

export function getApplicationTagSuggestions(
  args: GetTagSuggestionsProps,
  suggestionTimeConfig?: TimeConfig,
  applications: Record<string, ApplicationNode>,
  boundaryScope: ApplicationBoundaryScope
): Observable<Result<TagSuggestions>>;

export function getQueryBuilderForAlertType(
  alertType: ApplicationAlertType | Nullish,
  thresholdType?: ThresholdType
): CreateQueryBuilderResponse;
