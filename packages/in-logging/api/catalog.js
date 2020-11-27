import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { emptyObject } from 'in-services/fixedObjects';
import { minutes } from 'in-services/time/time';
import http from 'in-services/http';

const basePath = '/api/logging/catalog';

export const getTagCatalog = memoize(
  getTagCatalogInternal,
  // Do not take time configuration into consideration for the hash generation.
  ({ useCase } = emptyObject) => useCase,
  minutes.toMillis(10)
);

function getTagCatalogInternal({ useCase } = emptyObject) {
  return createObservable(
    http({
      method: 'GET',
      maxRetries: 3,
      url: basePath,
      queryParams: {
        useCase
      }
    })
  );
}
