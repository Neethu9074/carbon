import PropTypes from 'prop-types';
import React from 'react';

import { mapThresholdValueAndOperatorForAnalyze } from 'in-new-components/Alerting/utils/alertUtils';
import { applicationsAlertingEventDetailsGoToAnalyze } from 'in-applications/alerting/tracker';
import { translateDemocratisationFiltersToAnalyzeFilters } from 'in-applications/tags';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import Button from 'in-new-components/Button';

export default function AnalyzeApplicationEventButton({ event, alertConfig }) {
  const metadata = event.get('metadata');
  const entityId = event.get('entityId');
  const applicationName = metadata.get('entityLabel');
  const timeConfig = getTimeConfigFromEvent(event);
  const analyzeFilters = getEnrichedAnalyzeFilteres(alertConfig, entityId);

  return (
    <GoToAnalyzeButton
      applicationName={applicationName}
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

function GoToAnalyzeButton({ applicationName, filters, timeConfig, alertType }) {
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
        filters: translateDemocratisationFiltersToAnalyzeFilters({ applicationName, filters }),
        groupByTag,
        timeConfig
      })}
    >
      Analyze Calls
    </Button>
  );
}

function getEnrichedAnalyzeFilteres(alertConfig, applicationId) {
  const alertType = alertConfig.rule.alertType;
  let analyzeFilters = convertToAnalyzeFilters(alertConfig.tagFilters);
  analyzeFilters.push(getApplicationIdAnalyzeFilter(applicationId));
  if (alertType === 'errorRate') {
    analyzeFilters.push(getErroneousCallsAnalyzeFilter());
  } else if (alertType === 'slowness') {
    analyzeFilters.push(getThresholdLatencyAnalyzeFilter(alertConfig.threshold));
  } else if (alertType === 'logs') {
    analyzeFilters = analyzeFilters.concat(getLogCallsAnalyzeFilters(alertConfig.rule));
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

function getApplicationIdAnalyzeFilter(applicationId) {
  return {
    name: 'application.id',
    operator: 'EQUALS',
    value: applicationId
  };
}

function getErroneousCallsAnalyzeFilter() {
  return {
    name: 'call.erroneous',
    value: 'true'
  };
}

function getThresholdLatencyAnalyzeFilter(threshold) {
  const analyzeThreshold = mapThresholdValueAndOperatorForAnalyze(threshold.value, threshold.operator);
  return {
    name: 'call.latency',
    operator: analyzeThreshold.operator,
    value: analyzeThreshold.value
  };
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
