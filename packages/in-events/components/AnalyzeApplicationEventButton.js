/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { joinExpressions, fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { applicationsAlertingEventDetailsGoToAnalyze } from 'in-alerting/smart-alerts/applications/tracker';
import { containsTagName } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import { getDirectLinkToUA2 } from 'in-analyze/navigation/paths';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { entityTypes } from 'in-analyze/applicationFilter';
import Button from 'in-new-components/Button';
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
  endpointId
}) {
  const tagCatalog = useTagCatalog(getTagCatalog);
  const linkToUA = getLinkToUnboundAnalytics(
    applicationId,
    applicationName,
    serviceId,
    null,
    endpointId,
    null,
    alertConfig,
    timeConfig,
    tagCatalog
  );
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
  endpointId: PropTypes.string
};

export function getLinkToUnboundAnalytics(
  applicationId,
  applicationName,
  serviceId,
  serviceName, // still used for link in Affected Entities list
  endpointId,
  endpointName, // still used for link in Affected Entities list
  alertConfig,
  timeConfig,
  tagCatalog,
  groupingTagName = null
) {
  const { rule, tagFilterExpression, includeInternal, includeSynthetic } = alertConfig;
  const alertType = rule.alertType;

  const groupByTag = groupingTagName
    ? groupingTagName
    : getGroupingTagName(alertType, tagFilterExpression, serviceId, endpointId);

  return getDirectLinkToUA2({
    dataSource,
    timeConfig,
    groupBy: toGroupByTag(groupByTag),
    charts: getChartsParam(alertType),
    tagFilterExpression: getEnrichedAnalyzeTagFilterFormModel(
      alertConfig,
      applicationId,
      applicationName,
      serviceId,
      endpointId,
      timeConfig
    ),
    hiddenCalls: {
      includeInternal,
      includeSynthetic
    }
  });
}

export function getEnrichedAnalyzeTagFilterFormModel(
  alertConfig,
  applicationId,
  applicationName,
  serviceId,
  endpointId,
  timeConfig,
  excludeViolationRelatedFilters = false
) {
  const { rule, tagFilterExpression } = alertConfig;
  const alertType = rule.alertType;
  const blueprintConfig = getBlueprintConfig(alertType);
  return joinExpressions({
    expressions: [
      blueprintConfig.getEntityTagFilterFormModel(alertConfig, applicationId, applicationName, serviceId),
      fromBackendModel(tagFilterExpression),
      excludeViolationRelatedFilters ? [] : blueprintConfig.getRuleTagFilterFormModel(rule),
      excludeViolationRelatedFilters
        ? []
        : blueprintConfig.getExtraAnalyzeLinkTagFilterFormModel(alertConfig, timeConfig)
    ]
  });
}

function getChartsParam(alertType) {
  if (alertType === 'slowness') {
    return [
      {
        metric: 'latency',
        aggregation: 'DISTRIBUTION'
      }
    ];
  }
  if (alertType === 'errorRate') {
    // we don't show errors with MEAN aggregation here, because we already include a call.erroneous filter
    return [
      {
        metric: 'erroneousCalls',
        aggregation: 'SUM'
      }
    ];
  }
  // at the moment only 'latency_DISTRIBUTION' is available when no grouping is set. However, the analyze-view handles
  // this case properly and then shows the latency-distribution chart instead.
  return [
    {
      metric: 'calls',
      aggregation: 'SUM'
    }
  ];
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
