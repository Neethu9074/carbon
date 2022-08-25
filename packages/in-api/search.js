/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import http from 'in-services/http';

export function validate(query, context) {
  return http({
    method: 'GET',
    url: `/api/search/validate`,
    maxRetries: 3,
    queryParams: {
      q: query,
      searchContext: context
    }
  });
}
