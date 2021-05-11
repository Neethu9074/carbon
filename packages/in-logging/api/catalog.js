/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { emptyObject } from 'in-services/fixedObjects';
import { minutes } from 'in-services/time/time';
import http from 'in-services/http';

const basePath = '/api/logging-v2/catalog';

export const getTagCatalog = memoize(
  getTagCatalogInternal,
  // Do not take time configuration into consideration for the hash generation.
  ({ useCase } = emptyObject) => useCase,
  minutes.toMillis(10)
);

function getTagCatalogInternal({ useCase } = emptyObject) {
  return isInternalVisible$.flatMap(includeInternalTags =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: basePath,
        queryParams: {
          useCase,
          includeInternalTags
        }
      })
    ).map(r => {
      if (r.data) {
        return {
          ...r,
          data: {
            ...r.data,
            tags: [
              ...r.data.tags,
              {
                label: 'Trace Id',
                name: 'log.traceId',
                type: 'STRING'
              }
            ]
          }
        };
      }
      return r;
    })
  );
}
