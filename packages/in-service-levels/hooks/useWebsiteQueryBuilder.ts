/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useMemo } from 'react';

import { Result, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { DEFAULT_MAX_EXPRESSION_DEPTH } from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { createQueryBuilder, CreateQueryBuilderResponse } from 'in-components/QueryBuilder';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { getSuggestions as getWebsiteSuggestions } from 'in-websites/queryBuilder';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getTagCatalog } from 'in-websites/api/tagCatalog';
import useTimeConfig from 'in-hooks/useTimeConfig';

export interface UseWebsiteQueryBuilderProps {
  websiteId?: string;
  beaconType?: string;
}

function createBoundedQueryBuilder({
  websiteId,
  beaconType
}: UseWebsiteQueryBuilderProps = {}): CreateQueryBuilderResponse {
  return createQueryBuilder({
    maxExpressionDepth: DEFAULT_MAX_EXPRESSION_DEPTH,
    getTagCatalog: () => getTagCatalog({ beaconType, useCase: 'SLI_MANAGEMENT' }),
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
}: UseWebsiteQueryBuilderProps): CreateQueryBuilderResponse {
  return useMemo(() => createBoundedQueryBuilder({ websiteId, beaconType }), [websiteId, beaconType]);
}

interface UseValidateWebsiteFilterExpressionProps {
  isQueryValid: (filterExpression: FormModelElement[] | undefined, tc: TimeConfig) => Observable<Result<boolean>>;
  filterExpression?: FormModelElement[];
}

export function useValidateWebsiteFilterExpression({
  isQueryValid,
  filterExpression
}: UseValidateWebsiteFilterExpressionProps): boolean {
  const timeConfig = useTimeConfig();
  return !!useObservable(() => isQueryValid(filterExpression, timeConfig), [filterExpression, timeConfig])?.data;
}
