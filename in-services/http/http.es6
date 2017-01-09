import {create} from 'reactive-observables';

import HttpResponseStatusCodeError from 'in-services/http/HttpResponseStatusCodeError';
import HttpRequestTimeoutError from 'in-services/http/HttpRequestTimeoutError';
import HttpRequestAbortedError from 'in-services/http/HttpRequestAbortedError';
import HttpResponseError from 'in-services/http/HttpResponseError';

export default function({method, url, queryParams, data, timeout = 30000, responseType = 'json'}) {
  url = formatUrl(url, queryParams);
  let xhr;

  return create({
    start(observable) {
      xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.timeout = timeout;
      xhr.responseType = responseType === 'json' ? 'text' : responseType;

      xhr.addEventListener('timeout', () => observable.emitError(new HttpRequestTimeoutError(method, url)));
      xhr.addEventListener('error', () => observable.emitError(new HttpResponseError(method, url)));
      xhr.addEventListener('abort', () => observable.emitError(new HttpRequestAbortedError(method, url)));

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
          if (199 < response.status && response.status < 300) {
            if (responseType === 'json' && response.body && response.body.length > 0) {
              response.body = JSON.parse(response.body);
            }
            observable.emit(response);
          } else {
            observable.emitError(new HttpResponseStatusCodeError(response, method, url));
          }
          xhr = null;
        }
      });

      xhr.send(JSON.stringify(data));
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
  .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(queryParams[k]))
  .join('&');

  return url + '?' + queryPart;
}
