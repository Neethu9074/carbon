'use strict';

import Immutable from 'immutable';
import HttpRequestTimeoutError from './HttpRequestTimeoutError';
import HttpResponseError from './HttpResponseError';

export default function({method, url, queryParams, data, timeout=5000}) {
  url = formatUrl(url, queryParams);
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.timeout = timeout;
    xhr.responseType = 'json';
    xhr.ontimeout = () => {
      reject(new HttpRequestTimeoutError());
    };
    if (data) {
      xhr.setRequestHeader('Content-Type', 'application/json');
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const response = {
          status: xhr.status,
          statusText: xhr.statusText,
          body: Immutable.fromJS(xhr.response),
          getHeader: name => xhr.getResponseHeader(name)
        };
        if (199 < response.status && response.status < 300) {
          resolve(response);
        } else {
          reject(new HttpResponseError(response));
        }
      }
    };
    xhr.send(JSON.stringify(data));
  });
}

function formatUrl(url, queryParams={}) {
  const queryPart = Object.keys(queryParams)
  .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(queryParams[k]))
  .join('&');

  return url + '?' + queryPart;
}
