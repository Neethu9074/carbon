/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import { defaultGroupings, translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import { toTagFilterNumberOperator, isGreaterOperator } from 'in-new-components/Alerting/utils/alertUtils';
import { getTimeConfigFromEvent, getWidenedTimeConfigFromEvent } from 'in-events/timeframe';
import { websitesAlertingEventDetailsGoToAnalyze } from 'in-websites/alerting/tracker';
import { getBaselineValue } from 'in-new-components/Alerting/utils/baselineUtils';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import Button from 'in-new-components/Button';

const emptyTagFilter = {};

export default function AnalyzeWebsiteEventButton({ event, alertConfig }) {
  const metadata = event.get('metadata');
  const entityId = event.get('entityId');
  const websiteLabel = metadata.get('entityLabel');
  const tagFilters = alertConfig.tagFilters;
  const tagFiltersWithWebsiteId = [getWebsiteIdTagFilter(entityId), ...tagFilters];
  const alertType = alertConfig.rule.alertType;

  if (alertType === 'specificJsError') {
    return (
      <GoToAnalyzeButton
        websiteLabel={websiteLabel}
        tagFilters={[...tagFiltersWithWebsiteId, getErrorMessageTagFilter(alertConfig.rule)]}
        timeConfig={getTimeConfigFromEvent(event)}
        icon="lib_website_error"
        group={defaultGroupings.error}
        beaconType="error"
        title="Analyze JS Errors"
      />
    );
  }
  if (alertType === 'slowness') {
    const timeConfig = getTimeConfigFromEvent(event);
    const analyzeTagFilters =
      alertConfig.threshold.type === 'staticThreshold'
        ? [
            ...tagFiltersWithWebsiteId,
            getThresholdDurationTagFilter(alertConfig.threshold.value, alertConfig.threshold.operator)
          ]
        : [...tagFiltersWithWebsiteId, getBaselineDurationTagFilter(alertConfig, timeConfig)];
    return (
      <GoToAnalyzeButton
        websiteLabel={websiteLabel}
        tagFilters={analyzeTagFilters}
        timeConfig={timeConfig}
        icon="lib_website_page_load"
        group={defaultGroupings.none}
        beaconType="pageLoad"
        title="Analyze Load Time"
      />
    );
  }
  if (alertType === 'statusCode') {
    return (
      <GoToAnalyzeButton
        websiteLabel={websiteLabel}
        tagFilters={[...tagFiltersWithWebsiteId, getStatusCodeTagFilter(alertConfig.rule)]}
        timeConfig={getTimeConfigFromEvent(event)}
        icon="lib_website_ajax"
        group={defaultGroupings.httpRequest}
        beaconType="httpRequest"
        title="Analyze HTTP Requests"
      />
    );
  }
  if (alertType === 'throughput') {
    const metricName = alertConfig.rule.metricName;
    const isPageLoadMetric = metricName === 'pageLoads';
    return (
      <GoToAnalyzeButton
        websiteLabel={websiteLabel}
        tagFilters={tagFiltersWithWebsiteId}
        timeConfig={getWidenedTimeConfigFromEvent(event, alertConfig.granularity)}
        icon="lib_website_page_load"
        group={isPageLoadMetric ? defaultGroupings.pageLoad : defaultGroupings.pageChange}
        beaconType={isPageLoadMetric ? 'pageLoad' : 'pageChange'}
        title={isPageLoadMetric ? 'Analyze Page Loads' : 'Analyze Page Transitions'}
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
        timeConfig,
        showGraph: true
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

function getBaselineDurationTagFilter(alertConfig, timeConfig) {
  const { operator, baseline, deviationFactor } = alertConfig.threshold;
  const baselineGranularity = alertConfig.granularity;
  const isGreaterOp = isGreaterOperator(operator);
  const baselineValues = [];
  for (let time = timeConfig.to - timeConfig.windowSize; time <= timeConfig.to; time += baselineGranularity) {
    const baselineValue = getBaselineValue(time, baseline, deviationFactor, baselineGranularity, isGreaterOp);
    baselineValues.push(baselineValue);
  }

  if (baselineValues.length === 0) {
    return emptyTagFilter;
  }

  const thresholdValue = isGreaterOp ? Math.min(...baselineValues) : Math.max(...baselineValues);
  return getThresholdDurationTagFilter(thresholdValue, operator);
}

function getThresholdDurationTagFilter(thresholdValue, thresholdOperator) {
  return {
    name: 'beacon.duration',
    operator: toTagFilterNumberOperator(thresholdOperator),
    numberValue: thresholdValue
  };
}
