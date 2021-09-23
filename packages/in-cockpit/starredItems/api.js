/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function add({ id, label, type }) {
  return http({
    method: 'PUT',
    url: `/api/starred-item/${encodeURIComponent(type)}/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    data: { id, label, type },
    retries: 3
  });
}

export function remove({ id, type }) {
  return http({
    method: 'DELETE',
    url: `/api/starred-item/${encodeURIComponent(type)}/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    retries: 3
  });
}
