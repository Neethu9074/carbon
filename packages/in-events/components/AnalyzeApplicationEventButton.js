import PropTypes from 'prop-types';
import React from 'react';

import getConfigByDataSource, { groupByEndpointName, groupByServiceName } from 'in-analyze/AnalyzeView/dataSources';
import { isQB2Config, isQB2ModeEnabled } from 'in-new-components/Alerting/components/WithQB1orQB2';
import { applicationsAlertingEventDetailsGoToAnalyze } from 'in-applications/alerting/tracker';
import { getTimeConfigFromEvent, getWidenedTimeConfigFromEvent } from 'in-events/timeframe';
import { toTagFilterNumberOperator } from 'in-new-components/Alerting/utils/alertUtils';
import { getBaselineValue } from 'in-new-components/Alerting/utils/baselineUtils';
import { convertToAnalyzeFilters } from 'in-applications/tags';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';

const dataSource = 'calls';
const alertTypeWithDisabledGrouping = ['errorRate', 'slowness'];

export default function AnalyzeApplicationEventButton({ event, alertConfig }) {
  const metadata = event.get('metadata');
  const applicationName = metadata.get('entityLabel');
  const boundaryScope = alertConfig.boundaryScope;
  const timeConfig = getRelevantEventTimeframe(event, alertConfig);
  const analyzeFilters = getEnrichedAnalyzeFilters(alertConfig, timeConfig);

  return (
    <GoToAnalyzeButton
      applicationName={applicationName}
      boundaryScope={boundaryScope}
      filters={analyzeFilters}
      timeConfig={timeConfig}
      alertType={alertConfig.rule.alertType}
      convertedTagFilterExpression={alertConfig.convertedTagFilterExpression}
    />
  );
}

AnalyzeApplicationEventButton.propTypes = {
  event: PropTypes.object.isRequired,
  alertConfig: PropTypes.object.isRequired
};

function GoToAnalyzeButton({
  applicationName,
  boundaryScope,
  filters,
  timeConfig,
  alertType,
  convertedTagFilterExpression
}) {
  const isQB1Mode = !isQB2ModeEnabled;
  const disabled = isQB1Mode && isQB2Config(convertedTagFilterExpression);

  return (
    <Tooltip
      content={
        disabled && (
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
        href$={getLinkToAnalyze({
          applicationName,
          dataSource,
          boundaryScope,
          filters,
          groupByTag: getGrouping(alertType, filters),
          focusedMetric: getFocusedMetric(alertType),
          timeConfig
        })}
        disabled={disabled}
      >
        Analyze Calls
      </Button>
    </Tooltip>
  );
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
