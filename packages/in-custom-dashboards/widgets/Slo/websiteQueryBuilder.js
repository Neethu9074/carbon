/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { DEFAULT_MAX_EXPRESSION_DEPTH } from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getSuggestions as getWebsiteSuggestions } from 'in-websites/queryBuilder';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { createQueryBuilder } from 'in-components/QueryBuilder';
import { getTagCatalog } from 'in-websites/api/tagCatalog';

export function createBoundedQueryBuilder({ websiteId, beaconType }) {
  return createQueryBuilder({
    maxExpressionDepth: DEFAULT_MAX_EXPRESSION_DEPTH,
    getTagCatalog: () => getTagCatalog({ beaconType, useCase: 'FILTERING' }),
    getSuggestions: ({ tagFilterExpression, ...args }) =>
      getWebsiteSuggestions({
        ...args,
        beaconType,
        tagFilterExpression: addTagFilters(tagFilterExpression, [tagFilter('beacon.website.id', EQUALS, websiteId)])
      })
  });
}
