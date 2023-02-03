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
import { ADAPTIVE_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import getTagSuggestions from 'in-applications/subscriptions/getTagSuggestions';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { createQueryBuilder } from 'in-components/QueryBuilder';
import { CALLS } from 'in-applications/analyze/metrics';
import { isIdTag } from 'in-applications/tags';

/**
 * Creates a QueryBuilder that is bound to multiple applications.
 * To validate the query, simply use the statically created QueryBuilder for the
 * specific blueprint via {@link getQueryBuilderForAlertType}, because the any additional
 * application scope has no impact on the validity of the user defined query.
 *
 * @param applications         The application/service/endpoint-selection scope this alert is bound to.
 * @param boundaryScope        The applications boundary-scope this alert is bound to.
 * @param suggestionTimeConfig optional, the timeframe used for resolving tag-suggestions.
 * @param thresholdType        The selected threshold type.
 * @param ruleType             optional, specify blueprint or alertRule's type, e.g. 'logs', or 'slowness'
 *
 * @returns A QueryBuilder where the scope is bound to one or a set of specific applications.
 */
export function createBoundedAlertQueryBuilder(
  applications,
  boundaryScope,
  suggestionTimeConfig,
  thresholdType,
  ruleType
) {
  const { QueryBuilder, isQueryValid, toFormModel, getTagCatalog } = createQueryBuilder({
    getTagCatalog: props =>
      getApplicationTagCatalog({
        dataSource: CALLS,
        useCase: getUseCase(thresholdType, ruleType)
      })(props),
    getSuggestions: args =>
      isIdTag(args.name) ? null : getApplicationTagSuggestions(args, suggestionTimeConfig, applications, boundaryScope)
  });

  return { QueryBuilder, isQueryValid, toFormModel, getTagCatalog };
}

function getUseCase(thresholdType, ruleType) {
  if (ruleType === 'logs') {
    return 'SMART_ALERTS_LOGS';
  } else if (thresholdType === ADAPTIVE_BASELINE) {
    return 'SMART_ALERTS_ADAPTIVE_BASELINE';
  } else {
    return 'SMART_ALERTS';
  }
}

export function getApplicationTagSuggestions(args, suggestionTimeConfig, applications, boundaryScope) {
  return getTagSuggestions({
    ...tagSuggestionArgs(args, suggestionTimeConfig),
    tagFilterExpression: createTagFilterExpression(OPERATOR_AND, [
      toBackendQueryModel(getEntitySelectionAsTagFilterFormModel(applications, boundaryScope)),
      args.tagFilterExpression
    ])
  });
}

function tagSuggestionArgs(args, suggestionTimeConfig) {
  return {
    entity: args.entity,
    propose: args.propose,
    tagFilterExpression: args.tagFilterExpression,
    tagName: args.name,
    value: args.value,
    filter: {
      timeConfig: suggestionTimeConfig ?? args.timeConfig
    },
    secondLevelKeyTagName: args.key
  };
}

function create(alertType, thresholdType) {
  return createBoundedAlertQueryBuilder(undefined, undefined, undefined, thresholdType, alertType);
}

const defaultQueryBuilder = create(undefined);

const queryBuildersByAlertType = {
  SMART_ALERTS_LOGS: create('logs'),
  SMART_ALERTS_ADAPTIVE_BASELINE: create('', ADAPTIVE_BASELINE),
  SMART_ALERTS: defaultQueryBuilder
};

/**
 * Provides the default, alert-type/blueprint specific QueryBuilder with its specific
 * tagCatalog and query validation.
 * Currently, there are only 3 different use cases supported, see {@link #getUseCase()}
 *
 * @return returns a {@link defaultQueryBuilder} or the queryBuilder for the given alertType + thresholdType if it exists
 */
export function getQueryBuilderForAlertType(alertType = 'slowness', thresholdType = STATIC_THRESHOLD) {
  const useCase = getUseCase(thresholdType, alertType);
  return queryBuildersByAlertType[useCase] ?? defaultQueryBuilder;
}
