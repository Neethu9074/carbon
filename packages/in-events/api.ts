/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { Field, MapFormItems } from 'formalistic';
import { List, fromJS } from 'immutable';

import { Observable } from '@instana/observables';
import { ManualCloseInfo } from '@instana/types';

import { getHeader as getCsrfHeader, getHeader } from 'in-services/security/csrf';
import { Response } from 'in-services/http/types';
import { EventOrMap } from 'in-events/types';
import http from 'in-services/http';

export function manuallyCloseIssue(eventId: string, manualCloseInfo: ManualCloseInfo): Observable<ManualCloseInfo> {
  return http<ManualCloseInfo>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/events/settings/manual-close/${encodeURIComponent(eventId)}`,
    data: manualCloseInfo
  }).map(response => fromJS(response.body));
}

export function manuallyCloseIssues(manualCloseInfo: ManualCloseInfo): Observable<Response<MultiCloseResponse>> {
  return http<ManualCloseInfo>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/events/settings/manual-close/`,
    data: manualCloseInfo
  }).map(response => fromJS(response));
}

interface MultiCloseResponse {
  successfulRequests: string[];
  failedRequests: string[];
}

export function getManualCloseInfo(eventId: string): Observable<ManualCloseInfo> {
  return http<ManualCloseInfo>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/events/settings/manual-close/${encodeURIComponent(eventId)}`
  }).map(response => {
    return response.body;
  });
}

export function createManualCloseInfo(
  closeTimestamp: number = Date.now(),
  reasonForClosing: string = '',
  username: string = '',
  muteAlerts: boolean = false,
  disableEvent: boolean = false
): ManualCloseInfo {
  return {
    closeTimestamp,
    muteAlerts,
    disableEvent,
    reasonForClosing,
    username
  };
}

export interface ManualCloseInfoForm extends MapFormItems {
  reasonForClosing: Field<string>;
  muteAlerts: Field<boolean>;
  disableEvent: Field<boolean>;
}

export function getEvents(eventsList: string[]) {
  return http<List<EventOrMap>>({
    method: 'POST',
    maxRetries: 3,
    headers: getHeader(),
    url: `/api/events`,
    data: eventsList
  }).map(response => response.body);
}
