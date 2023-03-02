/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';
import { TimeConfig } from '@instana/types';

// @ts-expect-error
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { CatalogUseCase, LogTag, Result } from 'in-types';
import { emptyObject } from 'in-services/fixedObjects';
import { minutes } from 'in-services/time/time';
import http from 'in-services/http';

const basePath = '/api/logging/catalog';
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

interface CatalogResponse {
  tags: LogTag[];
}

function getTagCatalogInternal({ useCase, forceIncludeInternalTags }: GetTagCatalogParams = emptyObject): Observable<
  Result<CatalogResponse>
> {
  return isInternalVisible$.flatMap((includeInternalTags: boolean) =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: basePath,
        queryParams: {
          useCase,
          includeInternalTags: forceIncludeInternalTags || includeInternalTags
        }
      })
    )
  );
}
