/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  createApplicationIdTagFilter,
  createServiceIdTagFilter
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/tagFilterCreators';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { and } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
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
  scopeDownTagFilterFormModel,
  timeConfig,
  includeSynthetic
}) {
  const applicationIdTagFilter = createApplicationIdTagFilter(applicationId, boundaryScope);
  const serviceIdTagFilter = createServiceIdTagFilter(serviceId);

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
    tagFilterExpression: toBackendQueryModel(
      joinExpressions({
        logicalOperator: and,
        expressions: [applicationIdTagFilter, serviceIdTagFilter, scopeDownTagFilterFormModel]
      })
    ),
    metrics: {}
  });
}
