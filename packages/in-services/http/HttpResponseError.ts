/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import ExtendableError from 'in-services/util/ExtendableError';

export default class HttpResponseError extends ExtendableError {
  constructor(method: string, url: string) {
    super(`Failed to retrieve the resource (request failed): ${method} ${url}`);
  }
}
