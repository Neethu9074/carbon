/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import { t } from 'in-i18n';
import React from 'react';

import { defaultGroupings, translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import { toTagFilterNumberOperator, isGreaterOperator } from 'in-new-components/Alerting/utils/alertUtils';
import { websitesAlertingEventDetailsGoToAnalyze } from 'in-websites/alerting/tracker';
import { getBaselineValue } from 'in-new-components/Alerting/utils/baselineUtils';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import { propTypeTimeConfig } from 'in-stores/time/config';
import Button from 'in-new-components/Button';

const emptyTagFilter = {};

export default function AnalyzeWebsiteEventButton({ alertConfig, websiteName, timeConfig }) {
  const tagFilters = alertConfig.tagFilters;
  const tagFiltersWithWebsiteId = [getWebsiteIdTagFilter(alertConfig.websiteId), ...tagFilters];
  const alertType = alertConfig.rule.alertType;

  if (alertType === 'specificJsError') {
    return (
      <GoToAnalyzeButton
        websiteLabel={websiteName}
        tagFilters={[...tagFiltersWithWebsiteId, getErrorMessageTagFilter(alertConfig.rule)]}
        timeConfig={timeConfig}
        icon="lib_website_error"
        group={defaultGroupings.error}
        beaconType="error"
        title="Analyze JS Errors"
      />
    );
  }
  if (alertType === 'slowness') {
    const analyzeTagFilters =
      alertConfig.threshold.type === 'staticThreshold'
        ? [
            ...tagFiltersWithWebsiteId,
            getThresholdDurationTagFilter(alertConfig.threshold.value, alertConfig.threshold.operator)
          ]
        : [...tagFiltersWithWebsiteId, getBaselineDurationTagFilter(alertConfig, timeConfig)];
    return (
      <GoToAnalyzeButton
        websiteLabel={websiteName}
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
        websiteLabel={websiteName}
        tagFilters={[...tagFiltersWithWebsiteId, getStatusCodeTagFilter(alertConfig.rule)]}
        timeConfig={timeConfig}
        icon="lib_website_ajax"
        group={defaultGroupings.httpRequest}
        beaconType="httpRequest"
        title={t('in-events:titleAnalyzeHTTPRequests')}
      />
    );
  }
  if (alertType === 'throughput') {
    const metricName = alertConfig.rule.metricName;
    const isPageLoadMetric = metricName === 'pageLoads';
    return (
      <GoToAnalyzeButton
        websiteLabel={websiteName}
        tagFilters={tagFiltersWithWebsiteId}
        timeConfig={timeConfig}
        icon="lib_website_page_load"
        group={isPageLoadMetric ? defaultGroupings.pageLoad : defaultGroupings.pageChange}
        beaconType={isPageLoadMetric ? 'pageLoad' : 'pageChange'}
        title={isPageLoadMetric ? t('in-events:titleAnalyzePageLoads') : t('in-events:titleAnalyzePageTransitions')}
      />
    );
  }

  // yet unsupported alert type
  return null;
}

AnalyzeWebsiteEventButton.propTypes = {
  alertConfig: PropTypes.object.isRequired,
  websiteName: PropTypes.string.isRequired,
  timeConfig: propTypeTimeConfig.isRequired
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
