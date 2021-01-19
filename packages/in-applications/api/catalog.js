/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { isShowInternalTagsEnabled$ } from 'in-applications/isShowInternalTagsEnabled';
import createObservable from 'in-services/http/observableHttpResult';
import { roundDownToWeek } from 'in-services/util/date';
import http from 'in-services/http';

const basePath = '/api/application-monitoring/catalog';

// observables

export const getApplicationTagCatalog = ({ dataSource, useCase }) => ({ timeConfig }) => {
  const from = timeConfig ? (timeConfig.to || Date.now()) - timeConfig.windowSize : null;

  // Include internal tags depending on user setting.
  return isShowInternalTagsEnabled$.flatMap(includeInternalTags => {
    return createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: basePath,
        queryParams: {
          // round down the from timestamp to the beginning of the week to make the caching more efficient
          from: roundDownToWeek(from),
          dataSource: dataSource,
          useCase: useCase,
          includeInternalTags
        }
      })
    );
  });
};
