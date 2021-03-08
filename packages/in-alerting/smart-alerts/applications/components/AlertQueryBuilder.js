/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import {
  createTagFilterExpression,
  OPERATOR_AND
} from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { getApplicationIdTagFilter } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';
import { CALLS } from 'in-applications/analyze/metrics';

const { QueryBuilder: AlertQueryBuilder, isQueryValid } = createQueryBuilder({
  getTagCatalog: props => getApplicationTagCatalog({ dataSource: CALLS, useCase: 'SMART_ALERTS' })(props),
  getSuggestions: args => getTagSuggestions(tagSuggestionArgs(args))
});

export default AlertQueryBuilder;

export const isAlertQueryValid = ([tagFilterFormModel, timeConfig]) => isQueryValid(tagFilterFormModel, timeConfig);

/**
 * Creates a QueryBuilder that is bound to a single application. Consequently, the suggestions shown are only part of
 * that limited scope.
 * To validate the query, simply use the statically created {@link isAlertQueryValid} method reference,
 * because the additional application scope has no impact on the validity of the user defined query.
 * @param applicationId The application ID this alert is bound to.
 * @param boundaryScope The applications boundary-scope this alert is bound to.
 * @returns A QueryBuilder where the scope is bound to a single application.
 */
export function createBoundedAlertQueryBuilder(applicationId, boundaryScope) {
  const { QueryBuilder } = createQueryBuilder({
    getTagCatalog: props => getApplicationTagCatalog({ dataSource: CALLS, useCase: 'SMART_ALERTS' })(props),
    getSuggestions: args =>
      getTagSuggestions({
        ...tagSuggestionArgs(args),
        tagFilterExpression: createTagFilterExpression(OPERATOR_AND, [
          getApplicationIdTagFilter(boundaryScope, applicationId),
          args.tagFilterExpression
        ])
      })
  });
  return QueryBuilder;
}

function tagSuggestionArgs(args) {
  return {
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
