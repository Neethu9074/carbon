import React from 'react';
import PropTypes from 'prop-types';

import { defaultGroupings, translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import { getBaselineValue, baselineGranularity } from 'in-websites/eum-alerting/chart/baselineUtils';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import Button from 'in-new-components/Button';

const emptyTagFilter = {};

export default function AnalyzeEumButton({ event, alertConfig }) {
  const metadata = event.get('metadata');
  const entityId = event.get('entityId');
  const websiteLabel = metadata.get('entityLabel');
  const tagFilters = alertConfig.tagFilters;
  const tagFiltersWithWebsiteId = [getWebsiteIdTagFilter(entityId), ...tagFilters];
  const alertType = alertConfig.rule.alertType;
  const timeConfig = getTimeConfigFromEvent(event);

  if (alertType === alertTypes.specificJsError) {
    return (
      <GoToAnalyzeButton
        websiteLabel={websiteLabel}
        tagFilters={[...tagFiltersWithWebsiteId, getErrorMessageTagFilter(alertConfig.rule)]}
        timeConfig={timeConfig}
        icon={'lib_website_error'}
        group={defaultGroupings.error}
        beaconType={'error'}
        title={'Analyze JS Errors'}
      />
    );
  }
  if (alertType === alertTypes.slowness) {
    const analyzeTagFilters =
      alertConfig.threshold.type === 'staticThreshold'
        ? [
            ...tagFiltersWithWebsiteId,
            getThresholdDurationTagFilter(alertConfig.threshold.value, alertConfig.threshold.operator)
          ]
        : [...tagFiltersWithWebsiteId, getBaselineDurationTagFilter(alertConfig.threshold, timeConfig)];
    return (
      <GoToAnalyzeButton
        websiteLabel={websiteLabel}
        tagFilters={analyzeTagFilters}
        timeConfig={timeConfig}
        icon={'lib_website_page_load'}
        group={defaultGroupings.pageLoad}
        beaconType={'pageLoad'}
        title={'Analyze Load Time'}
      />
    );
  }

  // yet unsupported alert type
  return null;
}

AnalyzeEumButton.propTypes = {
  event: PropTypes.object.isRequired,
  alertConfig: PropTypes.object.isRequired
};

function GoToAnalyzeButton({ websiteLabel, tagFilters, timeConfig, icon, group, beaconType, title }) {
  return (
    <Button
      kind="primary"
      icon={icon}
      href$={getLinkToAnalyze({
        beaconType,
        tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({ websiteLabel, tagFilters }),
        group,
        timeConfig
      })}
    >
      {title}
    </Button>
  );
}

function getWebsiteIdTagFilter(websiteId) {
  return {
    name: 'beacon.website.id',
    operator: 'EQUALS',
    stringValue: websiteId
  };
}

function getErrorMessageTagFilter(alertRule) {
  return {
    name: 'beacon.error.message',
    operator: alertRule.operator,
    stringValue: alertRule.value
  };
}

function getBaselineDurationTagFilter(alertThreshold, timeConfig) {
  const isGreaterOp = isGreaterOperator(alertThreshold.operator);
  const baselineValues = [];
  for (let time = timeConfig.to - timeConfig.windowSize; time <= timeConfig.to; time += baselineGranularity) {
    const baselineValue = getBaselineValue(time, alertThreshold.baseline, alertThreshold.deviationFactor, isGreaterOp);
    baselineValues.push(baselineValue);
  }

  if (baselineValues.length === 0) {
    return emptyTagFilter;
  }

  const thresholdValue = isGreaterOp ? Math.min(...baselineValues) : Math.max(...baselineValues);
  return getThresholdDurationTagFilter(thresholdValue, alertThreshold.operator);
}

function getThresholdDurationTagFilter(thresholdValue, thresholdOperator) {
  // adjust value because tag-filters only support LESS_THAN and GREATER_THAN
  if (thresholdOperator === '<=') {
    thresholdValue = Math.floor(thresholdValue) + 1;
  } else if (thresholdOperator === '>=') {
    thresholdValue = Math.ceil(thresholdValue) - 1;
  }

  return {
    name: 'beacon.duration',
    operator: toTagFilterNumberOperator(thresholdOperator),
    numberValue: thresholdValue
  };
}

function toTagFilterNumberOperator(thresholdOperator) {
  switch (thresholdOperator) {
    case '<':
    case '<=':
      return 'LESS_THAN';
    case '>':
    case '>=':
      return 'GREATER_THAN';
    default:
      return thresholdOperator;
  }
}

function isGreaterOperator(operator) {
  return operator === '>=' || operator === '>';
}
