import createObservable from 'in-services/http/observableHttpResult';
import http from 'in-services/http';

const basePath = '/api/logging/catalog';

// observables

export const getTagCatalog = () => {
  return createObservable(
    http({
      method: 'GET',
      maxRetries: 3,
      url: basePath
    })
  );
};
