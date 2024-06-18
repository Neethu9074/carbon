/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Observable } from '@instana/observables';

import { PerspectiveItem } from 'in-bizops/utils/types';
import { getHeader } from 'in-services/security/csrf';
import { deepFreeze } from 'in-services/util/object';
import http from 'in-services/http/http';

const basePath = '/api/business-monitoring/business-perspectives';

export function createBusinessPerspective(data: any): Observable<any> {
  return http<any>({
    method: 'POST',
    url: `${basePath}`,
    headers: getHeader(),
    data: data
  }).map(response => deepFreeze(response.body));
}

export function deleteBusinessPerspective(perspectiveId: any): Observable<any> {
  return http<any>({
    method: 'DELETE',
    url: `${basePath}/${perspectiveId}`,
    headers: getHeader()
  }).map(response => deepFreeze(response.body));
}

export function getBusinessPerspective(id: string): Observable<any> {
  return http<any>({
    method: 'GET',
    url: `${basePath}/${id}`,
    headers: getHeader()
  }).map(response => deepFreeze(response.body));
}

export function updateBusinessPerspective(id: string, data: PerspectiveItem): Observable<any> {
  return http<any>({
    method: 'PUT',
    url: `${basePath}/${id}`,
    headers: getHeader(),
    data: data
  }).map(response => deepFreeze(response.body));
}
