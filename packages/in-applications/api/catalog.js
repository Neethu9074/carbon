import createObservable from 'in-services/http/observableHttpResult';
import http from 'in-services/http';

const basePath = '/api/application-monitoring/catalog';

// observables

export function getApplicationTagCatalog() {
  return createObservable(
    http({
      method: 'GET',
      maxRetries: 3,
      url: basePath
    })
  );
}
