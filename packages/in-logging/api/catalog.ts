/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TimeConfig, CatalogUseCase, LogTag, Result } from '@instana/types';
import { Observable } from '@instana/observables';

import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { emptyObject } from 'in-services/fixedObjects';
import { minutes } from 'in-services/time/time';
import { basePath } from 'in-logging/api/index';
import http from 'in-services/http';

const DEFAULT_USE_CASE = 'FILTERING';

interface GetTagCatalogParams {
  useCase?: CatalogUseCase;
  forceIncludeInternalTags?: boolean;
  timeConfig?: TimeConfig;
}

export const getTagCatalog = memoize(getTagCatalogInternal, getId, minutes.toMillis(10));

function getId({ useCase, forceIncludeInternalTags }: GetTagCatalogParams): string {
  // Do not take time configuration into consideration for the hash generation.
  return '' + useCase + forceIncludeInternalTags;
}

export interface CatalogResponse {
  tags: LogTag[];
}

function getTagCatalogInternal({
  useCase = DEFAULT_USE_CASE,
  forceIncludeInternalTags
}: GetTagCatalogParams = emptyObject): Observable<Result<CatalogResponse>> {
  return isInternalVisible$.flatMap((includeInternalTags: boolean) =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: basePath + 'catalog',
        queryParams: {
          useCase: useCase ?? DEFAULT_USE_CASE,
          includeInternalTags: forceIncludeInternalTags || includeInternalTags
        }
      })
    )
  );
}
