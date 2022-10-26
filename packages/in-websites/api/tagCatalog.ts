/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { generateStableHash } from '@instana/utils';
import { Observable } from '@instana/observables';

import { CatalogUseCase, DataSource, Result, TagCatalog } from 'in-types';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { minutes } from 'in-services/time/time';
import http from 'in-services/http';

interface GetTagCatalogProps {
  useCase: CatalogUseCase;

  // Provide either beaconType or dataSource
  beaconType?: string;
  dataSource?: DataSource;
}

export const getTagCatalog: (args: GetTagCatalogProps) => Observable<Result<TagCatalog>> = memoize(
  getTagCatalogInternal,
  // Do not take time configuration into consideration for the hash generation.
  ({ useCase, beaconType, dataSource }) =>
    generateStableHash({
      useCase,
      beaconType,
      dataSource
    }),
  minutes.toMillis(10)
);

function getTagCatalogInternal({
  useCase,
  beaconType,
  dataSource
}: GetTagCatalogProps): Observable<Result<TagCatalog>> {
  return createObservable(
    http<TagCatalog>({
      method: 'GET',
      maxRetries: 3,
      url: `/api/website-monitoring/catalog`,
      queryParams: {
        useCase,
        beaconType: beaconType || dataSource
      }
    })
  );
}
