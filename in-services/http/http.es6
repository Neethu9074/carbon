import {create} from 'reactive-observables';

import HttpRequestTimeoutError from './HttpRequestTimeoutError';
import HttpResponseError from './HttpResponseError';

export default function({method, url, queryParams, data, timeout = 5000, responseType = 'json'}) {
  url = formatUrl(url, queryParams);

  return create({
    start(observable) {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.timeout = timeout;
      xhr.responseType = responseType;
      xhr.ontimeout = () => {
        observable.emitError(new HttpRequestTimeoutError(method, url));
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
            observable.emit(response);
          } else {
            observable.emitError(new HttpResponseError(response, method, url));
          }
        }
      };
      xhr.send(JSON.stringify(data));
    }
  });
}

function formatUrl(url, queryParams = {}) {
  const queryPart = Object.keys(queryParams)
  .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(queryParams[k]))
  .join('&');

  return url + '?' + queryPart;
}
