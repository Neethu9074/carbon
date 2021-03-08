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
import { applicationsAlertingEventDetailsGoToAnalyze } from 'in-alerting/smart-alerts/applications/tracker';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { groupByEndpointName, groupByServiceName } from 'in-analyze/AnalyzeView/dataSources';
import AffectedEntities from 'in-events/components/AffectedEntities/AffectedEntities';
import { tagFiltersForBoundaryScopeUA1 } from 'in-analyze/navigation/paths';
import { isQB2ModeInSmartAlertsEnabled } from 'in-services/featureFlags';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { convertToAnalyzeFilters } from 'in-applications/tags';
import { isApplicationEntity } from 'in-services/entityUtils';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

export function SmartAlertAffectedEntities({
  alertConfig,
  event,
  applicationId,
  applicationName,
  serviceId,
  serviceName,
  endpointId,
  endpointName
}) {
  const tagCatalog = useTagCatalog(getTagCatalog);
  const { rule, boundaryScope, includeInternal, includeSynthetic } = alertConfig;

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
  if (isQB2ModeInSmartAlertsEnabled) {
    tagFilterExpression = toBackendQueryModel(
      getEnrichedAnalyzeTagFilterFormModel(
        alertConfig,
        applicationId,
        applicationName,
        serviceId,
        endpointId,
        timeConfig
      )
    );
    totalTagFilterExpression = toBackendQueryModel(
      getEnrichedAnalyzeTagFilterFormModel(
        alertConfig,
        applicationId,
        applicationName,
        serviceId,
        endpointId,
        timeConfig,
        true
      )
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
      applicationId,
      applicationName,
      needsGroupByEndpoint ? serviceId : item.id,
      needsGroupByEndpoint ? serviceName : item.name,
      needsGroupByEndpoint ? item.id : null,
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
        applicationId,
        applicationName,
        serviceId,
        serviceName,
        endpointId,
        endpointName,
        alertConfig,
        timeConfig,
        tagCatalog,
        needsGroupByEndpoint ? 'endpoint.name' : 'service.name'
      )}
    >
      {needsGroupByEndpoint
        ? t('in-events:showAllEndpoints', { count: total })
        : t('in-events:showAllServices', { count: total })}
    </Link>
  );

  return (
    <Card title={needsGroupByEndpoint ? t('in-events:affectedEndpoints') : t('in-events:affectedServices')}>
      <AffectedEntities
        tagFilters={tagFilters}
        totalTagFilters={totalTagFilters}
        tagFilterExpression={tagFilterExpression}
        totalTagFilterExpression={totalTagFilterExpression}
        includeInternal={includeInternal}
        includeSynthetic={includeSynthetic}
        timeConfig={timeConfig}
        filterGroup={needsGroupByEndpoint ? groupByEndpointName : groupByServiceName}
        createItemLink$={createItemLink$}
        renderLinkToAnalyzeAll={renderLinkToAnalyzeAll}
      />
    </Card>
  );
}
