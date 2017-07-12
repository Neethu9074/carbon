import { create } from 'reactive-observables';

import HttpResponseStatusCodeError from 'in-services/http/HttpResponseStatusCodeError';
import HttpRequestTimeoutError from 'in-services/http/HttpRequestTimeoutError';
import HttpRequestAbortedError from 'in-services/http/HttpRequestAbortedError';
import HttpResponseError from 'in-services/http/HttpResponseError';
import { createLogger } from 'instalog';

const logger = createLogger('xhrService');

export default function({
  method,
  url,
  queryParams,
  data,
  timeout = 30000,
  responseType = 'json',
  ignoreAbortErrors = true,
  treat400AsError = true,
  maxRetries = -1
}) {
  url = formatUrl(url, queryParams);
  let xhr;

  return create({
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

        xhr.addEventListener('readystatechange', () => {
          if (xhr.readyState === 4 && xhr.status !== 0) {
            const response = {
              status: xhr.status,
              statusText: xhr.statusText,
              body: xhr.response,
              getHeader: name => xhr.getResponseHeader(name)
            };
            if (
              (199 < response.status && response.status < 300) ||
              (!treat400AsError && 399 < response.status && response.status < 500)
            ) {
              if (responseType === 'json' && response.body && response.body.length > 0) {
                response.body = JSON.parse(response.body);
              }
              observable.emit(response);
            } else if (!attemptRetry()) {
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
          setTimeout(sendXhr, Math.pow(2, numberOfRetries) * 1000);
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
      xhr = null;
    }
  });
}

function formatUrl(url, queryParams = {}) {
  const queryPart = Object.keys(queryParams)
    .filter(k => queryParams[k] != null)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(queryParams[k]))
    .join('&');

  return url + '?' + queryPart;
}
