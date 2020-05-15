import PropTypes from 'prop-types';
import React from 'react';

import { baselineGranularity, getBaselineValue } from 'in-new-components/Alerting/utils/baselineUtils';
import { mapThresholdValueAndOperatorForAnalyze } from 'in-new-components/Alerting/utils/alertUtils';
import { applicationsAlertingEventDetailsGoToAnalyze } from 'in-applications/alerting/tracker';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import Button from 'in-new-components/Button';

export default function AnalyzeApplicationEventButton({ event, alertConfig }) {
  const metadata = event.get('metadata');
  const applicationName = metadata.get('entityLabel');
  const boundaryScope = alertConfig.boundaryScope;
  const timeConfig = getTimeConfigFromEvent(event);
  const analyzeFilters = getEnrichedAnalyzeFilters(alertConfig, timeConfig);

  return (
    <GoToAnalyzeButton
      applicationName={applicationName}
      boundaryScope={boundaryScope}
      filters={analyzeFilters}
      timeConfig={timeConfig}
      alertType={alertConfig.rule.alertType}
    />
  );
}

AnalyzeApplicationEventButton.propTypes = {
  event: PropTypes.object.isRequired,
  alertConfig: PropTypes.object.isRequired
};

function GoToAnalyzeButton({ applicationName, boundaryScope, filters, timeConfig, alertType }) {
  const dataSource = 'calls';
  const disableDefaultGrouping = ['errorRate', 'slowness'].includes(alertType);
  const groupByTag = disableDefaultGrouping ? {} : getConfigByDataSource(dataSource).defaultGrouping;
  return (
    <Button
      kind="primary"
      icon="lib_application_call"
      onClick={() => applicationsAlertingEventDetailsGoToAnalyze()}
      href$={getLinkToAnalyze({
        applicationName,
        dataSource,
        boundaryScope,
        filters,
        groupByTag,
        timeConfig
      })}
    >
      Analyze Calls
    </Button>
  );
}

function getEnrichedAnalyzeFilters(alertConfig, timeConfig) {
  const alertType = alertConfig.rule.alertType;
  let analyzeFilters = convertToAnalyzeFilters(alertConfig.tagFilters);
  if (alertType === 'errorRate') {
    analyzeFilters.push(getErroneousCallsAnalyzeFilter());
  } else if (alertType === 'slowness') {
    analyzeFilters.push(getThresholdLatencyAnalyzeFilter(alertConfig.threshold, timeConfig));
  } else if (alertType === 'logs') {
    analyzeFilters = analyzeFilters.concat(getLogCallsAnalyzeFilters(alertConfig.rule));
  } else if (alertType === 'statusCode') {
    analyzeFilters = analyzeFilters.concat(getStatusCodeAnalyzeFilter(alertConfig.rule));
  }
  return analyzeFilters;
}

function convertToAnalyzeFilters(tagFilters) {
  return tagFilters.map(tagFilter => {
    return {
      name: tagFilter.name,
      operator: tagFilter.operator,
      value: getTagFilterValue(tagFilter)
    };
  });
}

function getTagFilterValue(tagFilter) {
  if (tagFilter.hasOwnProperty('stringValue')) {
    return tagFilter.stringValue;
  }
  if (tagFilter.hasOwnProperty('numberValue')) {
    return tagFilter.numberValue;
  }
  return tagFilter.booleanValue;
}

function getErroneousCallsAnalyzeFilter() {
  return {
    name: 'call.erroneous',
    value: 'true'
  };
}

function getThresholdLatencyAnalyzeFilter(threshold, timeConfig) {
  let value;
  if (threshold.type === 'staticThreshold') {
    value = threshold.value;
  } else {
    value = getBaselineThresholdValue(threshold, timeConfig);
  }

  const analyzeThreshold = mapThresholdValueAndOperatorForAnalyze(value, threshold.operator);
  return {
    name: 'call.latency',
    operator: analyzeThreshold.operator,
    value: analyzeThreshold.value
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

function getBaselineThresholdValue(threshold, timeConfig) {
  const isGreaterOp = threshold.operator === '>=' || threshold.operator === '>';

  const baselineValues = [];
  for (let time = timeConfig.to - timeConfig.windowSize; time <= timeConfig.to; time += baselineGranularity) {
    baselineValues.push(getBaselineValue(time, threshold.baseline, threshold.deviationFactor, isGreaterOp));
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
