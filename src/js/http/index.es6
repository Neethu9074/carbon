'use strict';

import Immutable from 'immutable';
import HttpRequestTimeoutError from './HttpRequestTimeoutError';
import HttpResponseError from './HttpResponseError';

export function get(url) {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.timeout = 10000;
    xhr.responseType = 'json';
    xhr.ontimeout = () => {
      reject(new HttpRequestTimeoutError());
    };
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
    xhr.send();
  });
}
