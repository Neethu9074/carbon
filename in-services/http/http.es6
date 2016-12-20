import {create} from 'reactive-observables';
import {debounce} from 'lodash';

import HttpRequestTimeoutError from './HttpRequestTimeoutError';
import HttpResponseError from './HttpResponseError';

export default function({method, url, queryParams, data, timeout = 30000, responseType = 'json'}) {
  url = formatUrl(url, queryParams);
  let xhr;

  return create({
    start(observable) {
      // ontimeout callback is executed after onreadystatechange is executed for timeouts.
      // Debounce this seems to be the easiest way for information consumers about errors.
      // Not using observable.debounse as we do not want to delay the happy path.
      const debouncedEmitError = debounce(err => observable.emitError(err), 100);

      xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.timeout = timeout;
      xhr.responseType = responseType === 'json' ? 'text' : responseType;
      xhr.ontimeout = () => {
        debouncedEmitError(new HttpRequestTimeoutError(method, url));
      };
      if (data) {
        xhr.setRequestHeader('Content-Type', 'application/json');
      }
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
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
            debouncedEmitError(new HttpResponseError(response, method, url));
          }
          xhr = null;
        }
      };
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
