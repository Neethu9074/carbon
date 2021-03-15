/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { addTagFilters } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';
import { getTagCatalog } from 'in-websites/api/tagCatalog';
import { getSuggestions } from 'in-websites/queryBuilder';

function create(beaconType) {
  return createQueryBuilder({
    getTagCatalog: () => getTagCatalog({ beaconType, useCase: 'SMART_ALERTS' }),
    getSuggestions: args =>
      getSuggestions({
        ...tagSuggestionArgs(args),
        beaconType
      })
  });
}

const queryBuildersByBeaconType = {
  pageLoad: create('pageLoad'),
  pageChange: create('pageChange'),
  resourceLoad: create('resourceLoad'),
  httpRequest: create('httpRequest'),
  error: create('error'),
  custom: create('custom')
};

// Default query builder works for providing the tagCatalog, which is beacon-type independent
export const { QueryBuilder: AlertQueryBuilder, isQueryValid } = queryBuildersByBeaconType.pageLoad;
export default AlertQueryBuilder;

/* helper, to create a query-builder dependent query validator */
export const createIsAlertQueryValid = isQueryValid => ([tagFilterFormModel, timeConfig]) =>
  isQueryValid(tagFilterFormModel, timeConfig);

/**
 * Creates a QueryBuilder that is bound to a single website and beacon-type.
 * Consequently, the suggestions shown are only part of that limited scope.
 *
 * This extends the beacon-type specific QueryBuilders by an additional
 * tagFilterExpression for the suggestions, see #withWebsiteIdFilter
 *
 * To validate the query, simply use the statically created {@link isQueryValid} method reference,
 * because the additional website scope has no impact on the validity of the user defined query.
 * @param websiteId The website ID this alert is bound to.
 * @param beaconType one of the different beacon-types, see #queryBuildersByBeaconType
 * @returns A QueryBuilder where the scope is bound to a single website and beacon type.
 */
export function createBoundedAlertQueryBuilder(websiteId, beaconType = 'pageLoad') {
  return createQueryBuilder({
    getTagCatalog: () => getTagCatalog({ beaconType, useCase: 'SMART_ALERTS' }),
    getSuggestions: args =>
      getSuggestions({
        ...tagSuggestionArgs(withWebsiteIdFilter(args, websiteId)),
        beaconType
      })
  });
}

/**
 * provides the default, beacon-type specific QueryBuilder which can be used for
 * accessing the tagCatalog and do a query validation
 */
export function getQueryBuilderForBeaconType(beaconType = 'pageLoad') {
  return queryBuildersByBeaconType[beaconType];
}

function tagSuggestionArgs(args) {
  return {
    ...args,
    tagName: args.name,
    filter: {
      timeConfig: args.timeConfig
    },
    secondLevelKeyTagName: args.key
  };
}

function withWebsiteIdFilter(args, websiteId) {
  const { tagFilterExpression } = args;
  return {
    ...args,
    tagFilterExpression: addTagFilters(tagFilterExpression, [tagFilter('beacon.website.id', EQUALS, websiteId)])
  };
}
