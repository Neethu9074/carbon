/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import ExtendableError from 'in-services/util/ExtendableError';

export default class HttpRequestAbortedError extends ExtendableError {
  constructor(method, url) {
    super(`Request aborted: ${method} ${url}`);
  }
}
