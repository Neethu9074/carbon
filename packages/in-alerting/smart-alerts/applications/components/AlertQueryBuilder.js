/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  createTagFilterExpression,
  OPERATOR_AND,
  toBackendQueryModel
} from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getEntitySelectionAsTagFilterFormModel } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { createQueryBuilder } from 'in-components/QueryBuilder';
import { CALLS } from 'in-applications/analyze/metrics';
import { isIdTag } from 'in-applications/tags';

const { QueryBuilder: AlertQueryBuilder, isQueryValid } = createQueryBuilder({
  getTagCatalog: props => getApplicationTagCatalog({ dataSource: CALLS, useCase: 'SMART_ALERTS' })(props),
  getSuggestions: args => getTagSuggestions(tagSuggestionArgs(args))
});

export default AlertQueryBuilder;

export const isAlertQueryValid = ([tagFilterFormModel, timeConfig]) => isQueryValid(tagFilterFormModel, timeConfig);

/**
 * Creates a QueryBuilder that is bound to multiple applications.
 * To validate the query, simply use the statically created {@link isAlertQueryValid} method reference,
 * because the additional application scope has no impact on the validity of the user defined query.
 * @param applicationIds The application IDs this alert is bound to.
 * @param boundaryScope The applications boundary-scope this alert is bound to.
 * @returns A QueryBuilder where the scope is bound to a single application.
 */
export function createBoundedAlertQueryBuilder(applications, boundaryScope, customTimeConfig) {
  const { QueryBuilder } = createQueryBuilder({
    getTagCatalog: props => getApplicationTagCatalog({ dataSource: CALLS, useCase: 'SMART_ALERTS' })(props),
    getSuggestions: args =>
      isIdTag(args.name)
        ? null
        : getTagSuggestions({
            ...tagSuggestionArgs(args, customTimeConfig),
            tagFilterExpression: createTagFilterExpression(OPERATOR_AND, [
              toBackendQueryModel(getEntitySelectionAsTagFilterFormModel(applications, boundaryScope)),
              args.tagFilterExpression
            ])
          })
  });

  return QueryBuilder;
}

function tagSuggestionArgs(args, customTimeConfig) {
  return {
    entity: args.entity,
    propose: args.propose,
    tagFilterExpression: args.tagFilterExpression,
    tagName: args.name,
    value: args.value,
    filter: {
      timeConfig: customTimeConfig ?? args.timeConfig
    },
    secondLevelKeyTagName: args.key
  };
}
