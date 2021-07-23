/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Map } from 'immutable';
import React from 'react';

import { Card } from '@instana/components';
import { Link } from '@instana/components';

import {
  getLinkToUnboundAnalytics,
  getEnrichedAnalyzeTagFilterFormModel,
  tagNamesToUseEndpointGrouping
} from 'in-events/components/AnalyzeApplicationEventButton';
import { containsTagName, toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { applicationsAlertingEventDetailsGoToAnalyze } from 'in-alerting/smart-alerts/applications/tracker';
import { groupByEndpointName, groupByServiceName } from 'in-analyze/AnalyzeView/dataSources';
import AffectedEntities from 'in-events/components/AffectedEntities/AffectedEntities';
import { isApplicationEntity } from 'in-services/entityUtils';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
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
  const { rule, includeInternal, includeSynthetic } = alertConfig;

  if (rule.alertType === 'throughput') {
    // we don't show the affected services/endpoints list for this blueprint type, because there is no simple property
    // to differentiate single calls from being violated or non-violated. Thus, we have to come up with a new way to do
    // this distinction.
    return null;
  }

  const eventEntityType = event.get('entityType');
  const adaptiveBaselineInfo = (event.getIn(['metadata', 'adaptiveBaselineInfo'], Map({})) ?? Map({})).toJS();
  const timeConfig = getTimeConfigFromEvent(event);

  const tagFilterExpression = getTagFilterExpression();
  const totalTagFilterExpression = getTotalTagFilterExpression();
  const needsGroupByEndpoint =
    !isApplicationEntity(eventEntityType) ||
    tagNamesToUseEndpointGrouping.some(tagName => containsTagName(alertConfig.tagFilterExpression, tagName));

  const renderLinkToAnalyzeAll = total => (
    <Link
      onClick={() => applicationsAlertingEventDetailsGoToAnalyze()}
      href$={getLinkToUnboundAnalytics({
        applicationId,
        applicationName,
        serviceId,
        serviceName,
        endpointId,
        endpointName,
        alertConfig,
        timeConfig,
        groupingTagName: needsGroupByEndpoint ? 'endpoint.name' : 'service.name',
        adaptiveBaselineInfo
      })}
    >
      {needsGroupByEndpoint
        ? t('in-events:showAllEndpoints', { count: total })
        : t('in-events:showAllServices', { count: total })}
    </Link>
  );

  return (
    <Card title={needsGroupByEndpoint ? t('in-events:affectedEndpoints') : t('in-events:affectedServices')}>
      <AffectedEntities
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

  function getTagFilterExpression() {
    return toBackendQueryModel(
      getEnrichedAnalyzeTagFilterFormModel({
        alertConfig,
        applicationId,
        applicationName,
        serviceId,
        endpointId,
        timeConfig,
        adaptiveBaselineInfo
      })
    );
  }

  function getTotalTagFilterExpression() {
    return toBackendQueryModel(
      getEnrichedAnalyzeTagFilterFormModel({
        alertConfig,
        applicationId,
        applicationName,
        serviceId,
        endpointId,
        timeConfig,
        excludeViolationRelatedFilters: true,
        adaptiveBaselineInfo
      })
    );
  }

  function createItemLink$(item) {
    return getLinkToUnboundAnalytics({
      applicationId,
      applicationName,
      serviceId: needsGroupByEndpoint ? serviceId : item.id,
      serviceName: needsGroupByEndpoint ? serviceName : item.name,
      endpointId: needsGroupByEndpoint ? item.id : null, // we never have an ID here (e.g. for a PER-SERVICE SmartAlert), because we do a grouping by name.
      endpointName: needsGroupByEndpoint ? item.name : null,
      alertConfig,
      timeConfig,
      adaptiveBaselineInfo
    });
  }
}
