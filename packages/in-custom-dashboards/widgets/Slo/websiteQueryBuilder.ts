/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useMemo } from 'react';

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { DEFAULT_MAX_EXPRESSION_DEPTH } from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { createQueryBuilder, CreateQueryBuilderResponse } from 'in-components/QueryBuilder';
import { getSuggestions as getWebsiteSuggestions } from 'in-websites/queryBuilder';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { Result, TagFilterExpressionElement, TimeConfig } from 'in-types';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getTagCatalog } from 'in-websites/api/tagCatalog';
import useTimeConfig from 'in-hooks/useTimeConfig';

interface CreateBoundedQueryBuilderProps {
  websiteId?: string;
  beaconType?: string;
}

function createBoundedQueryBuilder({
  websiteId,
  beaconType
}: CreateBoundedQueryBuilderProps = {}): CreateQueryBuilderResponse {
  return createQueryBuilder({
    maxExpressionDepth: DEFAULT_MAX_EXPRESSION_DEPTH,
    getTagCatalog: () => getTagCatalog({ beaconType, useCase: 'SMART_ALERTS' }),
    getSuggestions: ({ tagFilterExpression, ...args }) =>
      getWebsiteSuggestions({
        ...args,
        beaconType,
        tagFilterExpression: addTagFilters(tagFilterExpression, [tagFilter('beacon.website.id', EQUALS, websiteId)])
      })
  });
}

export function useWebsiteQueryBuilder({
  beaconType,
  websiteId
}: CreateBoundedQueryBuilderProps): CreateQueryBuilderResponse {
  return useMemo(() => createBoundedQueryBuilder({ websiteId, beaconType }), [websiteId, beaconType]);
}

interface UseValidateWebsiteFilterExpressionProps {
  isQueryValid: (tfe: TagFilterExpressionElement | undefined, tc: TimeConfig) => Observable<Result<boolean>>;
  filterExpression?: TagFilterExpressionElement;
}

export function useValidateWebsiteFilterExpression({
  isQueryValid,
  filterExpression
}: UseValidateWebsiteFilterExpressionProps): boolean {
  const timeConfig = useTimeConfig();
  return !!useObservable(() => isQueryValid(filterExpression, timeConfig), [filterExpression, timeConfig])?.data;
}
