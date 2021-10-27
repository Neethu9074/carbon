/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useMemo } from 'react';

import { useObservable } from '@instana/hooks';

import { DEFAULT_MAX_EXPRESSION_DEPTH } from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getSuggestions as getWebsiteSuggestions } from 'in-websites/queryBuilder';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { createQueryBuilder } from 'in-components/QueryBuilder';
import { getTagCatalog } from 'in-websites/api/tagCatalog';
import useTimeConfig from 'in-hooks/useTimeConfig';

function createBoundedQueryBuilder({ websiteId, beaconType }) {
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

export function useWebsiteQueryBuilder({ beaconType, websiteId }) {
  return useMemo(() => createBoundedQueryBuilder({ websiteId, beaconType }), [websiteId, beaconType]);
}

export function useValidateWebsiteFilterExpression({ isQueryValid, filterExpression }) {
  const timeConfig = useTimeConfig();
  return !!useObservable(() => isQueryValid(filterExpression, timeConfig), [filterExpression, timeConfig])?.data;
}
