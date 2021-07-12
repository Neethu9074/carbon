/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import ExtendableError from 'in-services/util/ExtendableError';
import { Response } from 'in-services/http/types';

const isJsonTest = /^application\/([a-z0-9]+\+)?json.*$/i;

export default class HttpResponseStatusCodeError extends ExtendableError {
  response: Response<any>;

  constructor(response: Response<any>, method: string, url: string) {
    super(getMessage(response, method, url));
    this.response = response;
  }
}

function getMessage(response: Response<any>, method: string, url: string) {
  const contentType = response.getHeader('Content-Type');
  if (contentType && isJsonTest.test(contentType)) {
    const error = getEmbeddedError(response);
    if (error) {
      if (Array.isArray(error)) {
        return error.join(' | ');
      }
      return error;
    }
  }

  return `Failed to retrieve the resource: ${method} ${url} => ${response.status}`;
}

//This function is supposed to handle two cases: body being a JSON-object and body being stringified JSON
function getEmbeddedError({ body }: Response<any>): string | string[] | undefined {
  if (typeof body === 'object') {
    return body.errors || body.error;
  }

  try {
    const parsed = JSON.parse(body);
    return parsed.errors || parsed.error;
  } catch (e) {
    return undefined;
  }
}
