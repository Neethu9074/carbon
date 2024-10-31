/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Observable } from '@instana/observables';

import { Integration } from 'in-settings/tabs/GlobalSettings/pages/integrations/database/types';
import { getHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function getDbIntegrations(): Observable<Integration[]> {
  return http<Integration[]>({
    method: 'GET',
    url: '/api/settings/database-integration',
    maxRetries: 3,
    headers: getHeader()
  }).map(response => response.body);
}

export function saveDbIntegration(integration: Integration): Observable<Integration> {
  return http<Integration>({
    method: 'PUT',
    url: `/api/settings/database-integration/${encodeURIComponent(integration.type)}`,
    data: integration,
    maxRetries: 3,
    headers: getHeader()
  }).map(response => response.body);
}
