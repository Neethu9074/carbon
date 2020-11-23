import createObservable from 'in-services/http/observableHttpResult';
import http from 'in-services/http';

export function getTagCatalog({ useCase, beaconType }) {
  return createObservable(
    http({
      method: 'GET',
      maxRetries: 3,
      url: `/api/mobile-app-monitoring/catalog`,
      queryParams: {
        useCase,
        beaconType
      }
    })
  );
}
