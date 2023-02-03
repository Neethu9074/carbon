/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { createQueryBuilder } from 'in-components/QueryBuilder';
import { getTagCatalog } from 'in-websites/api/tagCatalog';
import { getSuggestions } from 'in-websites/queryBuilder';

/**
 * Creates a QueryBuilder that is bound to a single website, use-case and beacon-type.
 * Consequently, the suggestions shown are only part of that limited scope.
 *
 * This extends the beacon-type specific QueryBuilders by an additional
 * tagFilterExpression for the suggestions, see #withWebsiteIdFilter
 *
 * @param websiteId            The website ID this alert is bound to.
 * @param beaconType           One of the different beacon-types, see #queryBuildersByBeaconType
 * @param suggestionTimeConfig optional, the timeframe used for resolving tag-suggestions.
 * @param thresholdType        The selected threshold type, used for selecting the use-case
 *
 * @returns A QueryBuilder where the scope is bound to a single website and beacon type.
 */
export function createBoundedAlertQueryBuilder(
  websiteId,
  beaconType = 'pageLoad',
  thresholdType,
  suggestionTimeConfig
) {
  return createQueryBuilder({
    getTagCatalog: () => getTagCatalog({ beaconType, useCase: getUseCase(thresholdType) }),
    getSuggestions: args => getWebsiteTagSuggestions(args, websiteId, beaconType, suggestionTimeConfig)
  });
}

function getUseCase(thresholdType) {
  if (thresholdType === ADAPTIVE_BASELINE) {
    return 'SMART_ALERTS_ADAPTIVE_BASELINE';
  } else {
    return 'SMART_ALERTS';
  }
}

export function getWebsiteTagSuggestions(args, websiteId, beaconType, suggestionTimeConfig) {
  return getSuggestions({
    ...tagSuggestionArgs(withWebsiteIdFilter(args, websiteId), suggestionTimeConfig),
    beaconType
  });
}

function tagSuggestionArgs(args, suggestionTimeConfig) {
  return {
    ...args,
    tagName: args.name,
    timeConfig: suggestionTimeConfig ?? args.timeConfig,
    secondLevelKeyTagName: args.key
  };
}

function create(beaconType, thresholdType) {
  return createBoundedAlertQueryBuilder(undefined, beaconType, thresholdType);
}

const queryBuildersByBeaconTypeStatic = {
  pageLoad: create('pageLoad'),
  pageChange: create('pageChange'),
  resourceLoad: create('resourceLoad'),
  httpRequest: create('httpRequest'),
  error: create('error'),
  custom: create('custom')
};

const queryBuildersByBeaconTypeAdaptive = {
  pageLoad: create('pageLoad', ADAPTIVE_BASELINE),
  pageChange: create('pageChange', ADAPTIVE_BASELINE),
  resourceLoad: create('resourceLoad', ADAPTIVE_BASELINE),
  httpRequest: create('httpRequest', ADAPTIVE_BASELINE),
  error: create('error', ADAPTIVE_BASELINE),
  custom: create('custom', ADAPTIVE_BASELINE)
};

function withWebsiteIdFilter(args, websiteId) {
  const { tagFilterExpression } = args;
  if (websiteId)
    return {
      ...args,
      tagFilterExpression: addTagFilters(tagFilterExpression, [tagFilter('beacon.website.id', EQUALS, websiteId)])
    };

  return args;
}

/** helper, to create a query-builder dependent query validator */
export const createIsAlertQueryValid = isQueryValid => ([tagFilterFormModel, timeConfig]) =>
  isQueryValid(tagFilterFormModel, timeConfig);

/**
 * Provides the QueryBuilder specific for the given beacon-type and threshold-type.
 * It can be used for accessing the tagCatalog and do a query validation.
 *
 * Defaults to 'pageLoad' / 'static baseline'
 *
 * This will be enough for query validation.
 *
 * For any tag-suggestion, when accounting the website id is needed,
 * then use {@link createBoundedAlertQueryBuilder}
 */
export function getQueryBuilderForBeaconType(beaconType, thresholdType) {
  if (thresholdType === ADAPTIVE_BASELINE) {
    return queryBuildersByBeaconTypeAdaptive[beaconType ?? 'pageLoad'];
  }
  return queryBuildersByBeaconTypeStatic[beaconType ?? 'pageLoad'];
}
