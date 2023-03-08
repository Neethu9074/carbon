/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { generateStableHash } from '@instana/utils';
import { Observable } from '@instana/observables';

import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { CatalogUseCase, Result, TagCatalog } from 'in-types';
import { minutes } from 'in-services/time';
import http from 'in-services/http';

interface GetTagCatalogProps {
  useCase: CatalogUseCase;
}

export const getTagCatalog: (args: GetTagCatalogProps) => Observable<Result<TagCatalog>> = memoize(
  getTagCatalogInternal,
  // Do not take time configuration into consideration for the hash generation.
  ({ useCase }) =>
    generateStableHash({
      useCase
    }),
  minutes.toMillis(10)
);

function getTagCatalogInternal({ useCase }: GetTagCatalogProps): Observable<Result<TagCatalog>> {
  return createObservable(
    http<TagCatalog>({
      method: 'GET',
      maxRetries: 3,
      url: `/api/synthetics/catalog`,
      queryParams: {
        useCase
      }
    })
  );
}
