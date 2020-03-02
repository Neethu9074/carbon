import PropTypes from 'prop-types';
import React from 'react';

import { mapThresholdValueAndOperatorForAnalyze } from 'in-new-components/Alerting/utils/alertUtils';
import { translateDemocratisationFiltersToAnalyzeFilters } from 'in-applications/tags';
import { alertTypes } from 'in-applications/alerting/data/alertTypeConfigData';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import Button from 'in-new-components/Button';

export default function AnalyzeApplicationEventButton({ event, alertConfig }) {
  const metadata = event.get('metadata');
  const entityId = event.get('entityId');
  const applicationName = metadata.get('entityLabel');
  const filters = convertToAnalyzeFilters(alertConfig.tagFilters);
  const alertType = alertConfig.rule.alertType;
  const timeConfig = getTimeConfigFromEvent(event);

  let analyzeFilters = [getApplicationIdAnalyzeFilter(entityId), ...filters];
  if (alertType === alertTypes.errorRate) {
    analyzeFilters.push(getErroneousCallsAnalyzeFilter());
  } else if (alertType === alertTypes.slowness) {
    analyzeFilters.push(getThresholdLatencyAnalyzeFilter(alertConfig.threshold.value, alertConfig.threshold.operator));
  }

  return <GoToAnalyzeButton applicationName={applicationName} filters={analyzeFilters} timeConfig={timeConfig} />;
}

AnalyzeApplicationEventButton.propTypes = {
  event: PropTypes.object.isRequired,
  alertConfig: PropTypes.object.isRequired
};

function GoToAnalyzeButton({ applicationName, filters, timeConfig }) {
  const dataSource = 'calls';
  return (
    <Button
      kind="primary"
      icon="lib_application_call"
      href$={getLinkToAnalyze({
        applicationName,
        dataSource: dataSource,
        filters: translateDemocratisationFiltersToAnalyzeFilters({ applicationName, filters }),
        groupByTag: getConfigByDataSource(dataSource).defaultGrouping,
        timeConfig
      })}
    >
      Analyze Calls
    </Button>
  );
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

function getThresholdLatencyAnalyzeFilter(thresholdValue, thresholdOperator) {
  const analyzeThreshold = mapThresholdValueAndOperatorForAnalyze(thresholdValue, thresholdOperator);
  return {
    name: 'call.latency',
    operator: analyzeThreshold.operator,
    value: analyzeThreshold.value
  };
}
