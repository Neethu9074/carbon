import { combineLatest } from 'reactive-observables';

import { deepFreeze } from 'in-services/util/object';

export default function createObservable(observableHttpRequest) {
  const observable = combineLatest([
    observableHttpRequest.startWith(null),
    observableHttpRequest.errors().startWith(null)
  ]).map(([response, error]) => {
    return deepFreeze({
      data: response ? response.body : null,
      errors: error ? [{ code: mapStatusCode(error.response.status), message: error.message }] : [],
      progress: {
        loading: !response && !error
      },
      time: Date.now()
    });
  });

  return observable;
}

function mapStatusCode(statusCode) {
  if (statusCode === 403 || statusCode === 401) {
    return 'AUTH';
  }
  if (statusCode === 412) {
    return 'VALIDATION';
  }
  if (statusCode === 404) {
    return 'NOT_FOUND';
  }
  if (statusCode >= 400 && statusCode < 500) {
    return 'CLIENT';
  }
  return 'SERVER';
}
