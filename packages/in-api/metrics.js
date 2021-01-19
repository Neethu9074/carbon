/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { deepFreeze } from 'in-services/util/object';

import http from 'in-services/http';

export function getMetrics(data) {
  return http({
    method: 'POST',
    url: `/api/cassandra/metrics`,
    headers: getCsrfHeader(),
    maxRetries: 3,
    data: data
  }).map(response => deepFreeze(response.body));
}
