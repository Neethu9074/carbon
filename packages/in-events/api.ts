/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { List } from 'immutable';

import { getHeader } from 'in-services/security/csrf';
import { EventOrMap } from 'in-events/types';
import http from 'in-services/http/http';

export function getEvents(eventsList: string[]) {
  return http<List<EventOrMap>>({
    method: 'POST',
    maxRetries: 3,
    headers: getHeader(),
    url: `/api/events`,
    data: eventsList
  }).map(response => response.body);
}
