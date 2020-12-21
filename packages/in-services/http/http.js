import { create } from '@instana/observables';
import { createLogger } from '@instana/logger';

import HttpResponseStatusCodeError from 'in-services/http/HttpResponseStatusCodeError';
import HttpRequestTimeoutError from 'in-services/http/HttpRequestTimeoutError';
import HttpRequestAbortedError from 'in-services/http/HttpRequestAbortedError';
import createObservableResult from 'in-services/http/observableHttpResult';
import HttpResponseError from 'in-services/http/HttpResponseError';

const logger = createLogger('xhrService');

export default function({
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
}) {
  url = formatUrl(url, queryParams);
  let xhr;
  let retryTimeout;

  const observableHttpRequest = create({
    start(observable) {
      const shouldRetry = method.toLowerCase() !== 'post' && maxRetries > 0;
      let numberOfRetries = 0;

      if (__DEV__ && method.toLowerCase() !== 'post' && maxRetries === -1) {
        logger.warn(
          `Method is ${method}, but no retries have been set. Consider setting a number of retries for this xhr call.`
        );
      }

      function sendXhr() {
        xhr = new XMLHttpRequest();
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
          Object.keys(headers).forEach(k => xhr.setRequestHeader(k, headers[k]));
        }

        xhr.addEventListener('readystatechange', () => {
          if (xhr.readyState === 4 && xhr.status !== 0) {
            const response = {
              status: xhr.status,
              statusText: xhr.statusText,
              body: xhr.response,
              getHeader: name => xhr.getResponseHeader(name)
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
          xhr = null;
          retryTimeout = setTimeout(sendXhr, Math.pow(2, numberOfRetries) * 1000);
          return true;
        } else {
          return false;
        }
      }

      sendXhr();
    },

    stop() {
      if (xhr && xhr.readyState !== 4) {
        xhr.abort();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      retryTimeout = null;
      xhr = null;
    }
  });

  return mapToResultObject ? createObservableResult(observableHttpRequest) : observableHttpRequest;
}

function formatUrl(url, queryParams = {}) {
  const queryPart = Object.keys(queryParams)
    .filter(k => queryParams[k] != null)
    .map(mapQueryParameter.bind(null, queryParams))
    .join('&');
  return url + '?' + queryPart;
}

function mapQueryParameter(queryParams, key) {
  const value = queryParams[key];
  return Array.isArray(value)
    ? serializeArrayQueryParam(key, value)
    : `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
}

function serializeArrayQueryParam(key, value) {
  const encodedKey = encodeURIComponent(key);
  // ids=['a', 'b', 'c'] => 'ids=a&ids=b&ids=c'
  return value.reduce(
    (accumulator, currentValue, currentIndex) =>
      `${accumulator}${encodedKey}=${encodeURIComponent(currentValue)}${currentIndex < value.length - 1 ? '&' : ''}`,
    '' // initial value for reduce
  );
}

export function isSuccess(response) {
  return response && response.status >= 200 && response.status < 300;
}
