/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import http from 'in-services/http';

const baseUrl = '/api/events/settings/global-alert-configs/applications';

export function getAllGlobalAlertConfigs(asObservable = false) {
  const requestConfig = {
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: baseUrl
  };

  return asObservable ? createObservable(http(requestConfig)) : http(requestConfig).map(response => response.body);
}
