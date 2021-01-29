/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import {
  getBlueprintConfig,
  getBaselineThresholdValue,
  getApplicationNameTagFilter
} from 'in-applications/alerting/data/blueprintConfig';
import { joinExpressions, fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { isQB2Config, isQB2ModeEnabled } from 'in-new-components/Alerting/components/WithQB1orQB2';
import { containsTagName } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { applicationsAlertingEventDetailsGoToAnalyze } from 'in-applications/alerting/tracker';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { toTagFilterNumberOperator } from 'in-new-components/Alerting/utils/alertUtils';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { getLinkToAnalyze, getDirectLinkToUA2 } from 'in-analyze/navigation/paths';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { convertToAnalyzeFilters } from 'in-applications/tags';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { entityTypes } from 'in-analyze/applicationFilter';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';

const dataSource = 'calls';
const alertTypeWithDisabledGrouping = ['errorRate', 'slowness'];
export const tagNamesToUseEndpointGrouping = ['endpoint.id', 'endpoint.name', 'service.id', 'service.name'];

export default function AnalyzeApplicationEventButton({
  alertConfig,
  timeConfig,
  applicationName,
  serviceName,
  endpointName
}) {
  const tagCatalog = useTagCatalog(getTagCatalog);
  const linkToUA = getLinkToUnboundAnalytics(
    applicationName,
    serviceName,
    endpointName,
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
            The config for this is stored with Query Builder 2 expressions. <br /> You can only use this button with
            configs stored in Query Builder 1
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
        Analyze Calls
      </Button>
    </Tooltip>
  );
}

AnalyzeApplicationEventButton.propTypes = {
  alertConfig: PropTypes.object.isRequired,
  timeConfig: propTypeTimeConfig.isRequired,
  applicationName: PropTypes.string.isRequired,
  serviceName: PropTypes.string,
  endpointName: PropTypes.string
};

export function getLinkToUnboundAnalytics(
  applicationName,
  serviceName,
  endpointName,
  alertConfig,
  timeConfig,
  tagCatalog,
  groupingTagName = null
) {
  const { rule, boundaryScope, tagFilters, tagFilterExpression, convertedTagFilterExpression } = alertConfig;
  const alertType = rule.alertType;

  if (isQB2ModeEnabled) {
    const groupByTag = groupingTagName
      ? groupingTagName
      : getGroupingTagNameUA2(alertType, tagFilterExpression, serviceName, endpointName);

    // link to UA2
    return getDirectLinkToUA2({
      dataSource,
      timeConfig,
      groupBy: toUA2GroupByTag(groupByTag),
      charts: getChartsParam(alertType),
      tagFilterExpression: getEnrichedAnalyzeTagFilterFormModel(
        alertConfig,
        applicationName,
        serviceName,
        endpointName,
        timeConfig
      )
    });
  } else if (!isQB2Config(convertedTagFilterExpression)) {
    const groupByTag = groupingTagName
      ? groupingTagName
      : getGroupingTagNameUA1(alertType, tagFilters, serviceName, endpointName);

    // link to UA1
    return (
      tagCatalog &&
      getLinkToAnalyze({
        applicationName,
        serviceName,
        endpointName,
        dataSource,
        boundaryScope,
        filters: getEnrichedAnalyzeFilters(alertConfig, timeConfig),
        tagCatalog,
        groupByTag: toUA1GroupByTag(groupByTag),
        focusedMetric: getFocusedMetric(alertType),
        timeConfig
      })
    );
  }

  // no link possible because there is no backward compatibility from a QB2 config in QB1 mode
  return null;
}

export function getEnrichedAnalyzeTagFilterFormModel(
  alertConfig,
  applicationName,
  serviceName,
  endpointName,
  timeConfig
) {
  const { rule, boundaryScope, tagFilterExpression } = alertConfig;
  const alertType = rule.alertType;
  const blueprintConfig = getBlueprintConfig(alertType);
  return joinExpressions({
    expressions: [
      getApplicationNameTagFilter(boundaryScope, applicationName),
      serviceName ? tagFilter('service.name', 'EQUALS', serviceName) : [],
      endpointName ? tagFilter('endpoint.name', 'EQUALS', endpointName) : [],
      fromBackendModel(tagFilterExpression),
      blueprintConfig.getRuleTagFilterFormModel(rule),
      blueprintConfig.getExtraAnalyzeLinkTagFilterFormModel(alertConfig, timeConfig)
    ]
  });
}

export function getEnrichedAnalyzeFilters(alertConfig, timeConfig) {
  const alertType = alertConfig.rule.alertType;
  let analyzeFilters = convertToAnalyzeFilters(alertConfig.tagFilters);
  if (alertType === 'errorRate') {
    analyzeFilters.push(tagFilter('call.erroneous', 'EQUALS', true));
  } else if (alertType === 'slowness') {
    analyzeFilters.push(getThresholdLatencyAnalyzeFilter(alertConfig, timeConfig));
  } else if (alertType === 'logs') {
    analyzeFilters = analyzeFilters.concat(getLogCallsAnalyzeFilters(alertConfig.rule));
  } else if (alertType === 'statusCode') {
    analyzeFilters = analyzeFilters.concat(getStatusCodeAnalyzeFilter(alertConfig.rule));
  }
  return analyzeFilters;
}

function getThresholdLatencyAnalyzeFilter(alertConfig, timeConfig) {
  let value;
  if (alertConfig.threshold.type === 'staticThreshold') {
    value = alertConfig.threshold.value;
  } else {
    value = getBaselineThresholdValue(alertConfig, timeConfig);
  }

  return tagFilter('call.latency', toTagFilterNumberOperator(alertConfig.threshold.operator), value);
}

function getStatusCodeAnalyzeFilter(rule) {
  const analyzeFilters = [];
  if (rule.statusCodeStart === rule.statusCodeEnd) {
    analyzeFilters.push(tagFilter('call.http.status', 'EQUALS', rule.statusCodeStart));
  } else {
    analyzeFilters.push(tagFilter('call.http.status', 'GREATER_OR_EQUAL_THAN', rule.statusCodeStart));
    analyzeFilters.push(tagFilter('call.http.status', 'LESS_OR_EQUAL_THAN', rule.statusCodeEnd));
  }
  return analyzeFilters;
}

function getLogCallsAnalyzeFilters(rule) {
  const analyzeFilters = [];
  analyzeFilters.push(tagFilter('log.message', rule.operator, rule.message));
  if (rule.level !== 'ANY') {
    analyzeFilters.push(tagFilter('log.level', 'EQUALS', rule.level));
  }
  return analyzeFilters;
}

function getFocusedMetric(alertType) {
  if (alertType === 'slowness') {
    return 'latency_DISTRIBUTION';
  }
  if (alertType === 'errorRate') {
    return 'errors_MEAN';
  }
  // at the moment only 'latency_DISTRIBUTION' is available when no grouping is set. However, the analyze-view handles
  // this case properly and then shows the latency-distribution chart instead.
  return 'calls_SUM';
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

function getGroupingTagNameUA1(alertType, filters, serviceName, endpointName) {
  if (alertTypeWithDisabledGrouping.includes(alertType) || endpointName) {
    return null; // no grouping
  }

  if (serviceName) {
    return 'endpoint.name';
  }

  if (alertType === 'throughput') {
    const needsGroupByEndpoint = filters.find(isEndpointOrServiceFilter);
    return needsGroupByEndpoint ? 'endpoint.name' : 'service.name';
  }

  return getConfigByDataSource(dataSource).defaultGrouping.name;
}

function getGroupingTagNameUA2(alertType, tagFilterExpression, serviceName, endpointName) {
  if (alertTypeWithDisabledGrouping.includes(alertType) || endpointName) {
    return null; // no grouping
  }

  if (serviceName) {
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

function toUA1GroupByTag(tagName) {
  if (!tagName) {
    return {}; // no grouping
  }

  return {
    name: tagName,
    value: '',
    entity: entityTypes.DESTINATION
  };
}

function toUA2GroupByTag(tagName) {
  if (!tagName) {
    return {}; // no grouping
  }

  return {
    groupbyTag: tagName,
    groupbyTagEntity: entityTypes.DESTINATION
  };
}

export const isEndpointOrServiceFilter = filter => filter?.name && tagNamesToUseEndpointGrouping.includes(filter.name);
