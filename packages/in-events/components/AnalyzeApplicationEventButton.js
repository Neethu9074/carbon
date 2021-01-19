/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import getConfigByDataSource, { groupByEndpointName, groupByServiceName } from 'in-analyze/AnalyzeView/dataSources';
import { joinExpressions, fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { isQB2Config, isQB2ModeEnabled } from 'in-new-components/Alerting/components/WithQB1orQB2';
import { applicationsAlertingEventDetailsGoToAnalyze } from 'in-applications/alerting/tracker';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { getTimeConfigFromEvent, getWidenedTimeConfigFromEvent } from 'in-events/timeframe';
import { toTagFilterNumberOperator } from 'in-new-components/Alerting/utils/alertUtils';
import { getLinkToAnalyze, getDirectLinkToUA2 } from 'in-analyze/navigation/paths';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import { getBaselineValue } from 'in-new-components/Alerting/utils/baselineUtils';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { convertToAnalyzeFilters } from 'in-applications/tags';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';

const dataSource = 'calls';
const alertTypeWithDisabledGrouping = ['errorRate', 'slowness'];

export default function AnalyzeApplicationEventButton({ event, alertConfig }) {
  const metadata = event.get('metadata');
  const applicationName = metadata.get('entityLabel');
  const timeConfig = getRelevantEventTimeframe(event, alertConfig);

  return <GoToAnalyzeButton applicationName={applicationName} timeConfig={timeConfig} alertConfig={alertConfig} />;
}

AnalyzeApplicationEventButton.propTypes = {
  event: PropTypes.object.isRequired,
  alertConfig: PropTypes.object.isRequired
};

function GoToAnalyzeButton({ applicationName, timeConfig, alertConfig }) {
  const tagCatalog = useTagCatalog(getTagCatalog);
  const linkToUA = getLinkToUnboundAnalytics(applicationName, alertConfig, timeConfig, tagCatalog);
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

function getLinkToUnboundAnalytics(applicationName, alertConfig, timeConfig, tagCatalog) {
  const boundaryScope = alertConfig.boundaryScope;
  const alertRule = alertConfig.rule;
  const alertType = alertRule.alertType;

  if (isQB2ModeEnabled) {
    // link to UA2
    const blueprintConfig = getBlueprintConfig(alertType);
    return getDirectLinkToUA2({
      dataSource,
      timeConfig,
      tagFilterExpression: joinExpressions({
        expressions: [
          getApplicationNameTagFilter(boundaryScope, applicationName),
          fromBackendModel(alertConfig.tagFilterExpression),
          blueprintConfig.getRuleTagFilterExpression(alertRule)
        ]
      })
    });
  } else if (!isQB2Config(alertConfig.convertedTagFilterExpression)) {
    // link to UA1
    const filters = getEnrichedAnalyzeFilters(alertConfig, timeConfig);
    return (
      tagCatalog &&
      getLinkToAnalyze({
        applicationName,
        dataSource,
        boundaryScope,
        filters,
        tagCatalog,
        groupByTag: getGrouping(alertType, filters),
        focusedMetric: getFocusedMetric(alertType),
        timeConfig
      })
    );
  }

  // no link possible because there is no backward compatibility from a QB2 config in QB1 mode
  return null;
}

function getApplicationNameTagFilter(boundaryScope, applicationName) {
  return {
    name: boundaryScope === 'INBOUND' ? 'call.inbound_of_application' : 'application.name',
    operator: 'EQUALS',
    type: 'TAG_FILTER',
    value: applicationName
  };
}

function getRelevantEventTimeframe(event, alertConfig) {
  if (alertConfig.rule.alertType === 'throughput') {
    return getWidenedTimeConfigFromEvent(event, alertConfig.granularity);
  }
  return getTimeConfigFromEvent(event);
}

export function getEnrichedAnalyzeFilters(alertConfig, timeConfig) {
  const alertType = alertConfig.rule.alertType;
  let analyzeFilters = convertToAnalyzeFilters(alertConfig.tagFilters);
  if (alertType === 'errorRate') {
    analyzeFilters.push(getErroneousCallsAnalyzeFilter());
  } else if (alertType === 'slowness') {
    analyzeFilters.push(getThresholdLatencyAnalyzeFilter(alertConfig, timeConfig));
  } else if (alertType === 'logs') {
    analyzeFilters = analyzeFilters.concat(getLogCallsAnalyzeFilters(alertConfig.rule));
  } else if (alertType === 'statusCode') {
    analyzeFilters = analyzeFilters.concat(getStatusCodeAnalyzeFilter(alertConfig.rule));
  }
  return analyzeFilters;
}

function getErroneousCallsAnalyzeFilter() {
  return {
    name: 'call.erroneous',
    operator: 'EQUALS',
    value: 'true'
  };
}

function getThresholdLatencyAnalyzeFilter(alertConfig, timeConfig) {
  let value;
  if (alertConfig.threshold.type === 'staticThreshold') {
    value = alertConfig.threshold.value;
  } else {
    value = getBaselineThresholdValue(alertConfig, timeConfig);
  }

  return {
    name: 'call.latency',
    operator: toTagFilterNumberOperator(alertConfig.threshold.operator),
    value: value
  };
}

function getStatusCodeAnalyzeFilter(rule) {
  const analyzeFilters = [];
  if (rule.statusCodeStart === rule.statusCodeEnd) {
    analyzeFilters.push({
      name: 'call.http.status',
      operator: 'EQUALS',
      value: rule.statusCodeStart
    });
  } else {
    analyzeFilters.push({
      name: 'call.http.status',
      operator: 'GREATER_OR_EQUAL_THAN',
      value: rule.statusCodeStart
    });
    analyzeFilters.push({
      name: 'call.http.status',
      operator: 'LESS_OR_EQUAL_THAN',
      value: rule.statusCodeEnd
    });
  }
  return analyzeFilters;
}

function getBaselineThresholdValue(alertConfig, timeConfig) {
  const { operator, baseline, deviationFactor } = alertConfig.threshold;
  const baselineGranularity = alertConfig.granularity;
  const isGreaterOp = operator === '>=' || operator === '>';

  const baselineValues = [];
  for (let time = timeConfig.to - timeConfig.windowSize; time <= timeConfig.to; time += baselineGranularity) {
    baselineValues.push(getBaselineValue(time, baseline, deviationFactor, baselineGranularity, isGreaterOp));
  }
  return isGreaterOp ? Math.min(...baselineValues) : Math.max(...baselineValues);
}

function getLogCallsAnalyzeFilters(rule) {
  const analyzeFilters = [];
  analyzeFilters.push({
    name: 'log.message',
    operator: rule.operator,
    value: rule.message
  });
  if (rule.level !== 'ANY') {
    analyzeFilters.push({
      name: 'log.level',
      operator: 'EQUALS',
      value: rule.level
    });
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

function getGrouping(alertType, filters) {
  if (alertTypeWithDisabledGrouping.includes(alertType)) {
    return {}; // no grouping
  }

  if (alertType === 'throughput') {
    const needsGroupByEndpoint = filters.find(isEndpointOrServiceFilter);
    return needsGroupByEndpoint ? groupByEndpointName : groupByServiceName;
  }

  return getConfigByDataSource(dataSource).defaultGrouping;
}

const isEndpointOrServiceFilter = filter =>
  filter?.name &&
  (filter.name === 'endpoint.name' ||
    filter.name === 'service.name' ||
    filter.name === 'endpoint.id' ||
    filter.name === 'service.id');
