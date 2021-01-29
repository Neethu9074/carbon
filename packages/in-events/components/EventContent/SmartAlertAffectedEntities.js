/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  getEnrichedAnalyzeFilters,
  getLinkToUnboundAnalytics,
  getEnrichedAnalyzeTagFilterFormModel,
  isEndpointOrServiceFilter,
  tagNamesToUseEndpointGrouping
} from 'in-events/components/AnalyzeApplicationEventButton';
import { containsTagName, toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { fromBackendModel, joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import { applicationsAlertingEventDetailsGoToAnalyze } from 'in-applications/alerting/tracker';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { groupByEndpointName, groupByServiceName } from 'in-analyze/AnalyzeView/dataSources';
import { getApplicationNameTagFilter } from 'in-applications/alerting/data/blueprintConfig';
import AffectedEntities from 'in-events/components/AffectedEntities/AffectedEntities';
import { isQB2ModeEnabled } from 'in-new-components/Alerting/components/WithQB1orQB2';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { tagFiltersForBoundaryScopeUA1 } from 'in-analyze/navigation/paths';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { convertToAnalyzeFilters } from 'in-applications/tags';
import { isApplicationEntity } from 'in-services/entityUtils';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';

export function SmartAlertAffectedEntities({ alertConfig, event, applicationName, serviceName, endpointName }) {
  const tagCatalog = useTagCatalog(getTagCatalog);
  const { rule, boundaryScope } = alertConfig;

  if (rule.alertType === 'throughput') {
    // we don't show the affected services/endpoints list for this blueprint type, because there is no simple property
    // to differentiate single calls from being violated or non-violated. Thus, we have to come up with a new way to do
    // this distinction.
    return null;
  }

  const eventEntityType = event.get('entityType');
  const timeConfig = getTimeConfigFromEvent(event);

  let tagFilters;
  let totalTagFilters;
  let tagFilterExpression;
  let totalTagFilterExpression;
  let needsGroupByEndpoint;
  if (isQB2ModeEnabled) {
    tagFilterExpression = toBackendQueryModel(
      getEnrichedAnalyzeTagFilterFormModel(alertConfig, applicationName, serviceName, endpointName, timeConfig)
    );
    totalTagFilterExpression = toBackendQueryModel(
      getEnrichedAnalyzeTotalTagFilterFormModel(alertConfig, applicationName, serviceName, endpointName)
    );
    needsGroupByEndpoint =
      !isApplicationEntity(eventEntityType) ||
      tagNamesToUseEndpointGrouping.some(tagName => containsTagName(alertConfig.tagFilterExpression, tagName));
  } else {
    const applicationBoundaryScopeTagFilters = tagFiltersForBoundaryScopeUA1(boundaryScope, applicationName);
    tagFilters = [...getEnrichedAnalyzeFilters(alertConfig, timeConfig), ...applicationBoundaryScopeTagFilters];
    totalTagFilters = [...convertToAnalyzeFilters(alertConfig.tagFilters), ...applicationBoundaryScopeTagFilters];
    needsGroupByEndpoint =
      !isApplicationEntity(eventEntityType) || alertConfig.tagFilters.find(isEndpointOrServiceFilter);
  }

  const createItemLink$ = item => {
    return getLinkToUnboundAnalytics(
      applicationName,
      needsGroupByEndpoint ? serviceName : item.name,
      needsGroupByEndpoint ? item.name : null,
      alertConfig,
      timeConfig,
      tagCatalog
    );
  };

  const renderLinkToAnalyzeAll = total => (
    <Link
      onClick={() => applicationsAlertingEventDetailsGoToAnalyze()}
      href$={getLinkToUnboundAnalytics(
        applicationName,
        serviceName,
        endpointName,
        alertConfig,
        timeConfig,
        tagCatalog,
        needsGroupByEndpoint ? 'endpoint.name' : 'service.name'
      )}
    >
      Show all {total} {needsGroupByEndpoint ? 'endpoints' : 'services'}
    </Link>
  );

  return (
    <Card title={`Affected ${needsGroupByEndpoint ? 'Endpoints' : 'Services'}`}>
      <AffectedEntities
        tagFilters={tagFilters}
        totalTagFilters={totalTagFilters}
        tagFilterExpression={tagFilterExpression}
        totalTagFilterExpression={totalTagFilterExpression}
        timeConfig={timeConfig}
        filterGroup={needsGroupByEndpoint ? groupByEndpointName : groupByServiceName}
        createItemLink$={createItemLink$}
        renderLinkToAnalyzeAll={renderLinkToAnalyzeAll}
      />
    </Card>
  );
}

function getEnrichedAnalyzeTotalTagFilterFormModel(alertConfig, applicationName, serviceName, endpointName) {
  const { boundaryScope, tagFilterExpression } = alertConfig;
  return joinExpressions({
    expressions: [
      getApplicationNameTagFilter(boundaryScope, applicationName),
      serviceName ? tagFilter('service.name', 'EQUALS', serviceName) : [],
      endpointName ? tagFilter('endpoint.name', 'EQUALS', endpointName) : [],
      fromBackendModel(tagFilterExpression)
    ]
  });
}
