/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function updateUser(email, config) {
  return http({
    method: 'PUT',
    url: `/api/settings/users/${email}`,
    headers: getCsrfHeader(),
    data: config
  });
}
