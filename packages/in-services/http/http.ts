/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { stringify } from 'qs';

import { create, Observable, Subject } from '@instana/observables';
import { createLogger } from '@instana/logger';

import { Result } from 'in-types/result';
import HttpResponseStatusCodeError from 'in-services/http/HttpResponseStatusCodeError';
import HttpRequestTimeoutError from 'in-services/http/HttpRequestTimeoutError';
import HttpRequestAbortedError from 'in-services/http/HttpRequestAbortedError';
import createObservableResult from 'in-services/http/observableHttpResult';
import HttpResponseError from 'in-services/http/HttpResponseError';
import { Response } from 'in-services/http/types';

const logger = createLogger('xhrService');

interface QueryParams {
  [k: string]: string;
}

interface HttpRequestOptions {
  method: string;
  url: string;
  queryParams?: QueryParams;
  headers?: { [k: string]: string };
  /**
   * Any object that can be JSON serialized using JSON.stringify.
   */
  data?: any;
  timeout?: number;
  responseType?: 'text' | 'json';
  ignoreAbortErrors?: boolean;
  treat400AsError?: boolean;
  maxRetries?: number;
  mapToResultObject?: boolean;
}

function http(
  options: HttpRequestOptions & { responseType: 'text'; mapToResultObject: true }
): Observable<Result<string>>;
function http(options: HttpRequestOptions & { responseType: 'text' }): Observable<Response<string>>;
function http<T>(
  options: HttpRequestOptions & { responseType?: 'json'; mapToResultObject: true }
): Observable<Result<T>>;
function http<T>(options: HttpRequestOptions & { responseType?: 'json' }): Observable<Response<T>>;
function http<T>({
  method,
  url,
  queryParams,
  data,
  headers,
  timeout = 30000,
  responseType = 'json',
  ignoreAbortErrors = true,
  treat400AsError = true,
  maxRetries = -1,
  mapToResultObject = false
}: HttpRequestOptions): Observable<any> {
  url = formatUrl(url, queryParams);
  let xhr: XMLHttpRequest | undefined;
  let retryTimeout: any;

  const observableHttpRequest = create<Response<T>>({
    start,
    stop
  });

  return mapToResultObject ? createObservableResult<T>(observableHttpRequest) : observableHttpRequest;

  function start(observable: Subject<Response<T>>) {
    const shouldRetry = method.toLowerCase() !== 'post' && maxRetries > 0;
    let numberOfRetries = 0;

    if (__DEV__ && method.toLowerCase() !== 'post' && maxRetries === -1) {
      logger.warn(
        `Method is ${method}, but no retries have been set. Consider setting a number of retries for this xhr call.`
      );
    }

    function sendXhr() {
      const localXhr = (xhr = new XMLHttpRequest());
      xhr.open(method, url, true);
      xhr.timeout = timeout;
      xhr.responseType = responseType === 'json' ? 'text' : responseType;

      xhr.addEventListener('timeout', () => {
        if (!attemptRetry()) {
          observable.emitError(new HttpRequestTimeoutError(method, url));
        }
      });

      xhr.addEventListener('error', () => {
        if (!attemptRetry()) {
          observable.emitError(new HttpResponseError(method, url));
        }
      });

      if (!ignoreAbortErrors) {
        xhr.addEventListener('abort', () => observable.emitError(new HttpRequestAbortedError(method, url)));
      }

      if (data) {
        xhr.setRequestHeader('Content-Type', 'application/json');
      }

      if (headers) {
        Object.keys(headers).forEach(k => localXhr.setRequestHeader(k, headers[k]));
      }

      xhr.addEventListener('readystatechange', () => {
        if (localXhr.readyState === 4 && localXhr.status !== 0) {
          const response: Response<any> = {
            status: localXhr.status,
            statusText: localXhr.statusText,
            body: localXhr.response,
            getHeader: (name: string) => localXhr.getResponseHeader(name)
          };

          if (responseType === 'json' && response.body && response.body.length > 0) {
            try {
              response.body = JSON.parse(response.body);
            } catch (e) {
              // ignore, servers may respond with non json responses in case of 4xx or 5xx
            }
          }

          if (
            (199 < response.status && response.status < 300) ||
            (!treat400AsError && 399 < response.status && response.status < 500)
          ) {
            observable.emit(response);
          } else {
            observable.emitError(new HttpResponseStatusCodeError(response, method, url));
          }
        }
      });

      xhr.send(JSON.stringify(data));
    }

    function attemptRetry() {
      if (numberOfRetries < maxRetries && shouldRetry) {
        numberOfRetries++;
        xhr = undefined;
        retryTimeout = setTimeout(sendXhr, Math.pow(2, numberOfRetries) * 1000);
        return true;
      } else {
        return false;
      }
    }

    sendXhr();
  }

  function stop() {
    if (xhr && xhr.readyState !== 4) {
      xhr.abort();
    }
    clearTimeout(retryTimeout);
    retryTimeout = undefined;
    xhr = undefined;
  }
}
export default http;

function formatUrl(url: string, queryParams: QueryParams = {}) {
  const serializedQueryParams = stringify(queryParams);
  if (serializedQueryParams.length > 0) {
    return url + '?' + serializedQueryParams;
  }
  return url;
}
