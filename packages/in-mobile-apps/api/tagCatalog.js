/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { generateStableHash } from '@instana/utils';
import { minutes } from 'in-services/time/time';
import http from 'in-services/http';

export const getTagCatalog = memoize(
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

function getTagCatalogInternal({ useCase, beaconType, dataSource }) {
  const effectiveBeaconType = beaconType || dataSource;
  return createObservable(
    http({
      method: 'GET',
      maxRetries: 3,
      url: `/api/mobile-app-monitoring/catalog`,
      queryParams: {
        useCase,
        beaconType: effectiveBeaconType
      }
    })
  );
}
