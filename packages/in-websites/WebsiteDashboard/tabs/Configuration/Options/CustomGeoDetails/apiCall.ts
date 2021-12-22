/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';

/**
 * Function extracted from Uploader.tsx for ease of testing.
 */
export async function put(apiUrl: string, csvContent: string): Promise<Response> {
  return fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'text/csv',
      Accept: 'text/csv, application/json',
      ...getCsrfHeader()
    },
    body: csvContent
  });
}
