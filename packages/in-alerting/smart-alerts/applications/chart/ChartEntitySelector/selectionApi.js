/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getEntitySelectionAsTagFilterFormModel } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { and } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import getEndpoints from 'in-applications/subscriptions/getEndpoints';
import getServices from 'in-subscription/application/getServices';

export function getEnrichedFiltersForApplication(alertConfigWithFormModel, applicationId, serviceId) {
  const blueprintConfig = getBlueprintConfig(alertConfigWithFormModel.rule.alertType);

  return joinExpressions({
    expressions: [
      // don't define the serviceId to get the results of all services in scope
      blueprintConfig.getEntityTagFilterFormModel(alertConfigWithFormModel, applicationId, null, serviceId),
      // only use the user-defined filters, but not the rule-specific filters, to not exclude services that might not
      // match any call at the moment, but could do so in the future. Thus the user should be able to select them.
      alertConfigWithFormModel.tagFilterExpression
    ]
  });
}

export function getServiceList(queryWindowSize, enrichedTagFilterFormModel, includeSyntheticCalls) {
  return getServices({
    pagination: {
      page: 1,
      pageSize: 100
    },
    order: {
      by: 'serviceLabel',
      direction: 'ASC'
    },
    metrics: {
      endpoints: {
        metric: 'endpoints',
        aggregation: 'DISTINCT_COUNT'
      }
    },
    filter: {
      includeSyntheticCalls,
      timeConfig: {
        windowSize: queryWindowSize
      }
    },
    /* Part of follow-up: embed search for name as a tagFilter */
    tagFilterExpression: enrichedTagFilterFormModel && toBackendQueryModel(enrichedTagFilterFormModel),
    contextScope: 'NONE'
  });
}

export function fetchEndpoints({
  pageSize = 100,
  applicationId,
  boundaryScope,
  serviceId,
  tagFilterFormModel,
  applications,
  timeConfig,
  includeSynthetic
}) {
  const scopeDownTagFilter = getEntitySelectionAsTagFilterFormModel(
    applications,
    boundaryScope,
    applicationId,
    null,
    serviceId
  );

  const tagFilterExpression = toBackendQueryModel(
    joinExpressions({
      logicalOperator: and,
      expressions: tagFilterFormModel ? [scopeDownTagFilter, tagFilterFormModel] : [scopeDownTagFilter]
    })
  );

  return getEndpoints({
    pagination: {
      page: 1,
      pageSize
    },
    order: {
      by: 'endpointLabel',
      direction: 'ASC'
    },
    filter: {
      includeSyntheticCalls: includeSynthetic,
      timeConfig
    },
    /* Part of follow-up: embed search for name as a tagFilter */
    tagFilterExpression,
    metrics: {}
  });
}
