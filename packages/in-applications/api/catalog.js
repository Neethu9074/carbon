/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { isShowInternalTagsEnabled$ } from 'in-applications/isShowInternalTagsEnabled';
import createObservable from 'in-services/http/observableHttpResult';
import { newAnalyticsEnabled } from 'in-services/featureFlags';
import { roundDownToWeek } from 'in-services/util/date';
import { combineLatest } from '@instana/observables';
import { settings$ } from 'in-services/settings';
import http from 'in-services/http';
import { get } from 'lodash';

const basePath = '/api/application-monitoring/catalog';

export const getApplicationTagCatalog = ({ dataSource, useCase }) => ({ timeConfig }) => {
  const from = timeConfig ? (timeConfig.to || Date.now()) - timeConfig.windowSize : null;

  return combineLatest([
    settings$.map(settings => get(settings, ['use_queryable_tags_enabled'], newAnalyticsEnabled)),
    isShowInternalTagsEnabled$
  ]).flatMap(([useQueryableTags, includeInternalTags]) => {
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
          useQueryableTags: useQueryableTags,
          includeInternalTags
        }
      })
    );
  });
};
