/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

import { ApplicationDataSource, CatalogUseCase, Result, TagCatalog, TimeConfig } from 'in-types';
import { isTroubleshootingModeEnabled$ } from 'in-applications/isTroubleshootingModeEnabled';
import { roundDownToWeek } from 'in-services/util/date';
import http from 'in-services/http';

const basePath = '/api/application-monitoring/catalog';

export const getApplicationTagCatalog = ({
  dataSource,
  useCase
}: {
  dataSource: ApplicationDataSource;
  useCase: CatalogUseCase;
}) => ({ timeConfig }: { timeConfig: TimeConfig }): Observable<Result<TagCatalog>> => {
  // round down the from timestamp to the beginning of the week to make the caching more efficient
  const from = timeConfig ? roundDownToWeek((timeConfig.to || Date.now()) - timeConfig.windowSize) : undefined;

  return isTroubleshootingModeEnabled$.flatMap(includeInternalTags =>
    http<TagCatalog>({
      method: 'GET',
      maxRetries: 3,
      url: basePath,
      mapToResultObject: true,
      queryParams: {
        from,
        dataSource,
        useCase,
        includeInternalTags
      }
    })
  );
};
