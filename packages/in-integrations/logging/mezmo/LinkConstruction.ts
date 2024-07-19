/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { toParams } from 'in-stores/navigation/routing/stringifier';
import { Parameters } from 'in-stores/navigation/types';

export const logMezmoDefaultBaseURL = 'https://app.mezmo.com/';
export const ibmCloudDefaultBaseURL = 'https://cloud.ibm.com/observe/embedded-view/logging/';

export function constructLink(
  queryParameters: Parameters,
  instanceType: string,
  accountId: string,
  baseUrl: string | null
) {
  if (!baseUrl) {
    baseUrl = instanceType === 'LOG_DNA_SAAS' ? logMezmoDefaultBaseURL : ibmCloudDefaultBaseURL;
  }
  const url =
    instanceType === 'LOG_DNA_SAAS'
      ? `${baseUrl}${accountId}/logs/view${toParams(queryParameters, '?', '&')}`
      : `${baseUrl}${accountId}${toParams(queryParameters, '?', '&')}`;

  // Mezmo doesn't recognize an URL-encoded , (/%2c/i) as separator, only an unencoded ,
  return url.replace(/%2c/i, ',');
}
