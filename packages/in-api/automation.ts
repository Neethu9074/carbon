/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import http from 'in-services/http';
import { Action } from 'in-types';

export interface ResponseError {
  errors: string[];
}

export function getAllActions() {
  return http<Action[] | ResponseError>({
    method: 'GET',
    maxRetries: 3,
    url: '/api/automation/settings/actions'
  }).map(response => response.body);
}

export function getAction(actionId: string) {
  return http<Action | ResponseError>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/automation/settings/actions/${encodeURIComponent(actionId)}`,
    treat400AsError: false
  }).map(response => response.body);
}
