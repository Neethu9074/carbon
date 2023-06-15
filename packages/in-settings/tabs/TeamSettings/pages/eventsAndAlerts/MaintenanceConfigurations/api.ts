/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';

import {
  MaintenanceConfig,
  MaintenanceConfigSchedulingUnion,
  MaintenanceConfigV2,
  RecurrentMaintenanceWindow
} from '@instana/types';
import { generateUniqueShortId } from '@instana/utils';
import { Observable } from '@instana/observables';

import { WindowObject } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/RecurrentMaintenanceConfigForm';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';
import { t } from 'in-i18n';

export function getMaintenanceConfigs() {
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
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/v2/maintenance/${encodeURIComponent(config.id)}`,
    data: config
  }).map(response => fromJS(response.body));
}

export function deleteMaintenanceConfigV2(id: string) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/v2/maintenance/${encodeURIComponent(id)}`
  });
}

export function resumeMaintenanceConfig(id: string) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/v2/maintenance/${encodeURIComponent(id)}/resume`
  }).map(response => fromJS(response.body));
}

export function pauseMaintenanceConfig(id: string) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/v2/maintenance/${encodeURIComponent(id)}/pause`
  }).map(response => fromJS(response.body));
}

export function getMaintenanceConfigsMutable() {
  return http({
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
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/maintenance/${encodeURIComponent(config.id)}`,
    data: config
  }).map(response => fromJS(response.body));
}

export function deleteMaintenanceConfig(id: string) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/maintenance/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function createMaintenanceConfig(
  id: string,
  name = t('in-settings:api.newMaintenanceWindowDefaultName'),
  query = '',
  windows = []
) {
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
  scheduling: MaintenanceConfigSchedulingUnion = createDefaultSchedule()
): MaintenanceConfigV2 {
  return {
    id: id || generateUniqueShortId(),
    name,
    query,
    paused: paused || false,
    scheduling
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
