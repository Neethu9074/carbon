/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { isShowInternalTagsEnabled$ } from 'in-applications/isShowInternalTagsEnabled';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { generateStableHash } from 'in-services/util/id';
import { roundDownToWeek } from 'in-services/util/date';
import { minutes } from 'in-services/time/time';
import http from 'in-services/http';

export const getTagCatalog = memoize(
  getTagCatalogInternal,
  // Do not take time configuration into consideration for the hash generation.
  ({ useCase, dataSource }) =>
    generateStableHash({
      useCase,
      dataSource
    }),
  minutes.toMillis(10)
);

function getTagCatalogInternal({ useCase, dataSource, timeConfig }) {
  const from = timeConfig ? (timeConfig.to || Date.now()) - timeConfig.windowSize : null;
  return isShowInternalTagsEnabled$.flatMap(includeInternalTags => {
    return createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: '/api/application-monitoring/catalog',
        queryParams: {
          useCase,
          dataSource,
          // round down the from timestamp to the beginning of the week to make the caching more efficient
          from: roundDownToWeek(from),
          includeInternalTags
        }
      })
    );
  });
}
