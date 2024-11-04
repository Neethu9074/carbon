/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';

import {
  MaintenanceConfig,
  MaintenanceConfigSchedulingUnion,
  MaintenanceConfigV2,
  RecurrentMaintenanceWindow,
  Result,
  TagFilterExpressionElementUnion,
  TimeConfig
} from '@instana/types';
import { generateUniqueShortId } from '@instana/utils';
import { Observable } from '@instana/observables';

import { WindowObject } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/RecurrentMaintenanceConfigForm';
import { GetSuggestionsProps, Suggestions, getSuggestions } from 'in-alerting/smart-alerts/synthetics/api/queryBuilder';
import { CreateQueryBuilderResponse, createQueryBuilder } from 'in-components/QueryBuilder';
import { getTagCatalog } from 'in-alerting/smart-alerts/synthetics/api/tagCatalog';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http, { Response } from 'in-services/http';
import { t } from 'in-i18n';

export function getMaintenanceConfigs(): Observable<MaintenanceConfig> {
  return getMaintenanceConfigsMutable().map(fromJS);
}

export function getMaintenanceConfigsMutableV2(): Observable<MaintenanceConfigV2[]> {
  return http<MaintenanceConfigV2[]>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/v2/maintenance`
  }).map(response => response.body);
}

export function getMaintenanceConfigV2(id: string): Observable<MaintenanceConfigV2> {
  return http<MaintenanceConfigV2>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/v2/maintenance/${encodeURIComponent(id)}`
  }).map(response => response.body);
}

export function saveMaintenanceConfigV2(config: MaintenanceConfigV2): Observable<MaintenanceConfigV2> {
  return http<MaintenanceConfigV2>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/v2/maintenance/${encodeURIComponent(config.id)}`,
    data: config
  }).map(response => fromJS(response.body));
}

export function deleteMaintenanceConfigV2(id: string): Observable<Response<MaintenanceConfig>> {
  return http<MaintenanceConfig>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/v2/maintenance/${encodeURIComponent(id)}`
  });
}

export function resumeMaintenanceConfig(id: string): Observable<MaintenanceConfigV2> {
  return http<MaintenanceConfigV2>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/v2/maintenance/${encodeURIComponent(id)}/resume`
  }).map(response => fromJS(response.body));
}

export function pauseMaintenanceConfig(id: string): Observable<MaintenanceConfigV2> {
  return http<MaintenanceConfigV2>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/v2/maintenance/${encodeURIComponent(id)}/pause`
  }).map(response => fromJS(response.body));
}

export function getMaintenanceConfigsMutable(): Observable<MaintenanceConfig> {
  return http<MaintenanceConfig>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/maintenance`
  }).map(response => response.body);
}

export function getMaintenanceConfig(id: string): Observable<MaintenanceConfig> {
  return http<MaintenanceConfig>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/maintenance/${encodeURIComponent(id)}`,
    treat400AsError: false
  }).map(response => fromJS(response.body));
}

export function saveMaintenanceConfig(config: MaintenanceConfig): Observable<MaintenanceConfig> {
  return http<MaintenanceConfig>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/maintenance/${encodeURIComponent(config.id)}`,
    data: config
  }).map(response => fromJS(response.body));
}

export function deleteMaintenanceConfig(id: string): Observable<MaintenanceConfigV2> {
  return http<MaintenanceConfigV2>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/maintenance/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function getTagSuggestions(
  args: GetSuggestionsProps,
  suggestionTimeConfig?: TimeConfig
): Observable<Result<Suggestions>> {
  return getSuggestions({
    ...args,
    name: args.name,
    timeConfig: suggestionTimeConfig ?? args.timeConfig,
    key: args.key,
    value: args.value
  });
}

export function createBoundedAlertQueryBuilder(suggestionTimeConfig?: TimeConfig): CreateQueryBuilderResponse {
  return createQueryBuilder({
    getTagCatalog: () => getTagCatalog({ useCase: 'MAINTENANCE_WINDOWS' }),
    getSuggestions: args => getTagSuggestions(args, suggestionTimeConfig)
  });
}

export function createMaintenanceConfig(
  id: string,
  name = t('in-settings:api.newMaintenanceWindowDefaultName'),
  query = '',
  windows = []
): MaintenanceConfig {
  return {
    id: id || generateUniqueShortId(),
    name,
    query,
    windows
  };
}

export function createMaintenanceConfigV2(
  id?: string,
  paused?: boolean,
  name: string = '',
  query: string = '',
  scheduling: MaintenanceConfigSchedulingUnion = createDefaultSchedule(),
  tagFilterExpressionEnabled?: boolean,
  tagFilterExpression?: TagFilterExpressionElementUnion
): MaintenanceConfigV2 {
  return {
    id: id || generateUniqueShortId(),
    name,
    query,
    paused: paused || false,
    scheduling,
    tagFilterExpressionEnabled: tagFilterExpressionEnabled || false,
    tagFilterExpression
  };
}

export function createMaintenanceWindow(id: string, start: Date | null, end: Date | null): WindowObject {
  return {
    id: id || generateUniqueShortId(),
    start,
    end
  };
}

export function createMaintenanceWindowV2(id: string, start: Date | null): WindowObject {
  return {
    id: id || generateUniqueShortId(),
    start
  };
}

function createDefaultSchedule(): RecurrentMaintenanceWindow {
  return {
    type: 'RECURRENT',
    start: -1,
    duration: {
      amount: 0,
      unit: 'HOURS'
    },
    rrule: ''
  };
}
