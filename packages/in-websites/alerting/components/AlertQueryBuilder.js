/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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

// deprecated, please use blueprint - or createBoundedAlertQueryBuilder
export const { QueryBuilder: AlertQueryBuilder, isQueryValid } = createBoundedAlertQueryBuilder();
// deprecated, please use blueprint - or createBoundedAlertQueryBuilder
export default AlertQueryBuilder;

/* create a query-builder dependent query validator */
export const createIsAlertQueryValid = isQueryValid => ([tagFilterFormModel, timeConfig]) =>
  isQueryValid(tagFilterFormModel, timeConfig);

/**
 * Creates a QueryBuilder that is bound to a single website. Consequently, the suggestions shown are only part of
 * that limited scope.
 * To validate the query, simply use the statically created {@link isAlertQueryValid} method reference,
 * because the additional website scope has no impact on the validity of the user defined query.
 * @param websiteId The website ID this alert is bound to.
 * @param beaconType one of the different beacon-types, see #queryBuildersByBeaconType
 * @returns A QueryBuilder where the scope is bound to a single website.
 */
export function createBoundedAlertQueryBuilder(websiteId, beaconType = 'pageLoad') {
  const queryBuilderAndValidator = queryBuildersByBeaconType[beaconType];
  return queryBuilderAndValidator;
}

function tagSuggestionArgs(args) {
  return {
    ...args,
    entity: args.entity,
    propose: args.propose,
    tagFilterExpression: args.tagFilterExpression,
    tagName: args.name,
    value: args.value,
    filter: {
      timeConfig: args.timeConfig
    },
    secondLevelKeyTagName: args.key
  };
}
