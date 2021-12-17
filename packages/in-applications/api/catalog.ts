/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

import { ApplicationDataSource, CatalogUseCase, Result, TagCatalog, ThresholdType, TimeConfig } from 'in-types';
import { isShowInternalTagsEnabled$ } from 'in-applications/isShowInternalTagsEnabled';
import { roundDownToWeek } from 'in-services/util/date';
import http from 'in-services/http';

const basePath = '/api/application-monitoring/catalog';

export const getApplicationTagCatalog = ({
  dataSource,
  useCase,
  ruleType,
  thresholdType
}: {
  dataSource: ApplicationDataSource;
  useCase: CatalogUseCase;
  ruleType?: string; // There is no existing Type for that, so string will be sufficient
  thresholdType?: ThresholdType;
}) => ({ timeConfig }: { timeConfig: TimeConfig }): Observable<Result<TagCatalog>> => {
  // round down the from timestamp to the beginning of the week to make the caching more efficient
  const from = timeConfig ? roundDownToWeek((timeConfig.to || Date.now()) - timeConfig.windowSize) : undefined;

  return isShowInternalTagsEnabled$.flatMap(includeInternalTags =>
    http<TagCatalog>({
      method: 'GET',
      maxRetries: 3,
      url: basePath,
      mapToResultObject: true,
      queryParams: {
        from,
        dataSource,
        useCase,
        includeInternalTags,
        ruleType,
        thresholdType
      }
    })
  );
};
