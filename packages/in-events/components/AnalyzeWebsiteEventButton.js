import PropTypes from 'prop-types';
import React from 'react';

import { defaultGroupings, translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import { getBaselineValue, baselineGranularity } from 'in-new-components/Alerting/utils/baselineUtils';
import { mapThresholdValueAndOperatorForAnalyze } from 'in-new-components/Alerting/utils/alertUtils';
import { websitesAlertingEventDetailsGoToAnalyze } from 'in-websites/alerting/tracker';
import { alertTypes } from 'in-websites/alerting/data/blueprintConfig';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import Button from 'in-new-components/Button';

const emptyTagFilter = {};

export default function AnalyzeWebsiteEventButton({ event, alertConfig }) {
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
        icon="lib_website_error"
        group={defaultGroupings.error}
        beaconType="error"
        title="Analyze JS Errors"
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
        icon="lib_website_page_load"
        group={defaultGroupings.pageLoad}
        beaconType="pageLoad"
        title="Analyze Load Time"
      />
    );
  }
  if (alertType === alertTypes.specificStatusCode) {
    return (
      <GoToAnalyzeButton
        websiteLabel={websiteLabel}
        tagFilters={[...tagFiltersWithWebsiteId, getStatusCodeTagFilter(alertConfig.rule)]}
        timeConfig={timeConfig}
        icon="lib_website_ajax"
        group={defaultGroupings.httpRequest}
        beaconType="httpRequest"
        title="Analyze HTTP Requests"
      />
    );
  }

  // yet unsupported alert type
  return null;
}

AnalyzeWebsiteEventButton.propTypes = {
  event: PropTypes.object.isRequired,
  alertConfig: PropTypes.object.isRequired
};

function GoToAnalyzeButton({ websiteLabel, tagFilters, timeConfig, icon, group, beaconType, title }) {
  return (
    <Button
      kind="primary"
      icon={icon}
      onClick={() => websitesAlertingEventDetailsGoToAnalyze(beaconType)}
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

function getStatusCodeTagFilter(alertRule) {
  return {
    name: 'beacon.http.status',
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
  const analyzeThreshold = mapThresholdValueAndOperatorForAnalyze(thresholdValue, thresholdOperator);

  return {
    name: 'beacon.duration',
    operator: analyzeThreshold.operator,
    numberValue: analyzeThreshold.value
  };
}

function isGreaterOperator(operator) {
  return operator === '>=' || operator === '>';
}
