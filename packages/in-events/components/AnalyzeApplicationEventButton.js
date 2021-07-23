/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@instana/components';

import { applicationsAlertingEventDetailsGoToAnalyze } from 'in-alerting/smart-alerts/applications/tracker';
import { joinExpressions, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { containsTagName } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import { getLinkToAnalyze } from 'in-applications/navigation/paths';
import { createChartedMetric } from 'in-analyze/navigation/paths';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { entityTypes } from 'in-analyze/applicationFilter';
import Tooltip from 'in-components/Tooltip';
import { t, Trans } from 'in-i18n';

const dataSource = 'calls';
const alertTypeWithDisabledGrouping = ['errorRate', 'slowness'];
export const tagNamesToUseEndpointGrouping = ['endpoint.id', 'endpoint.name', 'service.id', 'service.name'];

export default function AnalyzeApplicationEventButton({
  alertConfig,
  timeConfig,
  applicationId,
  applicationName,
  serviceId,
  endpointId,
  adaptiveBaselineInfo = {}
}) {
  const linkToUA = getLinkToUnboundAnalytics({
    applicationId,
    applicationName,
    serviceId,
    endpointId,
    alertConfig,
    timeConfig,
    adaptiveBaselineInfo
  });
  const linkDisabled = !linkToUA;

  return (
    <Tooltip
      content={
        linkDisabled && (
          <div>
            <Trans i18nKey="in-events:tooltipAnalyzeCalls" />
          </div>
        )
      }
    >
      <Button
        kind="primary"
        icon="lib_application_call"
        onClick={() => applicationsAlertingEventDetailsGoToAnalyze()}
        href$={linkToUA}
        disabled={linkDisabled}
      >
        {t('in-events:analyzeCalls')}
      </Button>
    </Tooltip>
  );
}

AnalyzeApplicationEventButton.propTypes = {
  alertConfig: PropTypes.object.isRequired,
  timeConfig: propTypeTimeConfig.isRequired,
  applicationId: PropTypes.string.isRequired,
  applicationName: PropTypes.string,
  serviceId: PropTypes.string,
  adaptiveBaselineInfo: PropTypes.object,
  endpointId: PropTypes.string
};

export function getLinkToUnboundAnalytics({
  applicationId,
  applicationName,
  serviceId,
  serviceName, // still used for link in Affected Entities list
  endpointId,
  endpointName, // still used for link in Affected Entities list
  alertConfig,
  timeConfig,
  adaptiveBaselineInfo,
  groupingTagName = null
}) {
  const { rule, tagFilterExpression, includeInternal, includeSynthetic } = alertConfig;
  const alertType = rule.alertType;

  const groupByTag = groupingTagName
    ? groupingTagName
    : getGroupingTagName(alertType, tagFilterExpression, serviceId, endpointId);

  const enrichedAnalyzeTagFilterFormModel = getEnrichedAnalyzeTagFilterFormModel({
    alertConfig,
    applicationId,
    applicationName,
    serviceId,
    endpointId,
    timeConfig,
    endpointName,
    serviceName,
    adaptiveBaselineInfo
  });

  return getLinkToAnalyze({
    dataSource,
    timeConfig,
    groupBy: toGroupByTag(groupByTag),
    chartedMetrics: getChartsParam(alertType),
    formModel: enrichedAnalyzeTagFilterFormModel,
    hiddenCalls: {
      includeInternal,
      includeSynthetic
    }
  });
}

export function getEnrichedAnalyzeTagFilterFormModel({
  alertConfig,
  applicationId,
  applicationName,
  serviceId,
  endpointId,
  timeConfig,
  excludeViolationRelatedFilters = false,
  endpointName,
  serviceName,
  adaptiveBaselineInfo = {}
}) {
  const { rule, tagFilterExpression } = alertConfig;
  const alertType = rule.alertType;
  const blueprintConfig = getBlueprintConfig(alertType);

  return joinExpressions({
    expressions: [
      applicationName
        ? blueprintConfig.getEntityTagFilterFormModel(
            alertConfig,
            applicationId,
            applicationName,
            serviceId,
            endpointId
          )
        : null,
      serviceName ? tagFilter('service.name', EQUALS, serviceName) : null, // service.name is still used by the affected entities list
      endpointName ? tagFilter('endpoint.name', EQUALS, endpointName) : null, // endpoint.name is still used by the affected entities list
      fromBackendModel(tagFilterExpression),
      excludeViolationRelatedFilters ? [] : blueprintConfig.getRuleTagFilterFormModel(rule),
      excludeViolationRelatedFilters
        ? []
        : blueprintConfig.getExtraAnalyzeLinkTagFilterFormModel(alertConfig, timeConfig, adaptiveBaselineInfo)
    ].filter(Boolean)
  });
}

function getChartsParam(alertType) {
  if (alertType === 'slowness') {
    return [createChartedMetric('latency', 'DISTRIBUTION')];
  }
  if (alertType === 'errorRate') {
    // we don't show errors with MEAN aggregation here, because we already include a call.erroneous filter
    return [createChartedMetric('erroneousCalls', 'SUM')];
  }
  // at the moment only 'latency_DISTRIBUTION' is available when no grouping is set. However, the analyze-view handles
  // this case properly and then shows the latency-distribution chart instead.
  return [createChartedMetric('calls', 'SUM')];
}

function getGroupingTagName(alertType, tagFilterExpression, serviceId, endpointId) {
  if (alertTypeWithDisabledGrouping.includes(alertType) || endpointId) {
    return null; // no grouping
  }

  if (serviceId) {
    return 'endpoint.name';
  }

  if (alertType === 'throughput') {
    const needsGroupByEndpoint = tagNamesToUseEndpointGrouping.some(tagName =>
      containsTagName(tagFilterExpression, tagName)
    );

    return needsGroupByEndpoint ? 'endpoint.name' : 'service.name';
  }

  return dataSourceConstants.calls.defaultGrouping.groupbyTag;
}

function toGroupByTag(tagName) {
  if (!tagName) {
    return {}; // no grouping
  }

  return {
    groupbyTag: tagName,
    groupbyTagEntity: entityTypes.DESTINATION
  };
}
