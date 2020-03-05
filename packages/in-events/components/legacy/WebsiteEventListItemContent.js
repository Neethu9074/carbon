import React from 'react';

import { alertingMetricsGranularity, alertingEventDetailsChartTimeframe } from 'in-websites/eum-alerting/constants';
import StatusCodeAlertingBarChart from 'in-websites/eum-alerting/chart/StatusCodeAlertingBarChart';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import JsErrorsAlertingBarChart from 'in-websites/eum-alerting/chart/JsErrorsAlertingBarChart';
import SlownessAlertingBarChart from 'in-websites/eum-alerting/chart/SlownessAlertingBarChart';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import AnalyzeWebsiteEventButton from 'in-events/components/AnalyzeWebsiteEventButton';
import WebsiteAlertConfigButton from 'in-events/components/WebsiteAlertConfigButton';
import { getAlertConfigByIdAndTimestamp } from 'in-websites/api/websiteAlertConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import ChartSwitch from 'in-websites/eum-alerting/components/ChartSwitch';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import { DescriptionItem } from 'in-components/DescriptionList';
import connectTo from 'in-hoc/connectTo';

import locals from './WebsiteEventListItemContent.mless';

export default connectTo(
  ({ event }) => {
    const observables = {};
    const configId = event.getIn(['metadata', 'eventSpecificationId']);
    const configTimestamp = event.getIn(['metadata', 'alertConfigCreated']);
    observables.alertConfig = getAlertConfigByIdAndTimestamp(configId, configTimestamp);
    return observables;
  },
  function WebsiteEventListItemContent({ event, alertConfig }) {
    if (!event || !alertConfig) {
      return null;
    }

    const entityId = event.get('entityId');
    const metadata = event.get('metadata');
    const websiteLabel = metadata.get('entityLabel');
    const tagFilters = alertConfig.tagFilters;
    const tagFiltersWithWebsiteId = [getWebsiteIdTagFilter(entityId), ...tagFilters];
    const sensitivity = alertConfig.threshold.deviationFactor;
    const metricName = alertConfig.rule.metricName || 'errors';
    const alertType = alertConfig.rule.alertType;
    const aggregation = alertConfig.rule.aggregation || null;
    const threshold = alertConfig.threshold;
    const thresholdWithSeasonality = { ...threshold, type: getThresholdTypeWithSeasonality(threshold) };

    const timeConfig = getChartTimeConfigByEvent({ event });
    timeConfig.windowSize = alertingEventDetailsChartTimeframe;

    return (
      <>
        <ProblemDescription event={event} />
        <WebsiteAlertConfigButton alertConfig={alertConfig} />
        <div className={locals.sectionWrapper}>
          <div className={locals.analyzeButtonWrapper}>
            <AnalyzeWebsiteEventButton event={event} alertConfig={alertConfig} />
          </div>
          <ChartSwitch
            alertType={alertType}
            JsErrorsComponent={() => (
              <JsErrorsAlertingBarChart
                websiteId={entityId}
                timeConfig={timeConfig}
                tagFilters={tagFilters}
                errorFilter={getErrorMessageTagFilter(alertConfig.rule)}
                granularity={alertingMetricsGranularity}
                metricName={metricName}
                threshold={alertConfig.threshold}
                timeThreshold={alertConfig.timeThreshold}
              />
            )}
            StatusCodeComponent={() => (
              <StatusCodeAlertingBarChart
                websiteId={entityId}
                timeConfig={timeConfig}
                tagFilters={tagFilters}
                numeratorFilter={getStatusCodeTagFilter(alertConfig.rule)}
                granularity={alertingMetricsGranularity}
                metricName={metricName}
                threshold={alertConfig.threshold}
                timeThreshold={alertConfig.timeThreshold}
              />
            )}
            SlownessComponent={() => (
              <SlownessAlertingBarChart
                websiteId={entityId}
                sensitivity={sensitivity}
                timeConfig={timeConfig}
                tagFilters={tagFiltersWithWebsiteId}
                aggregation={aggregation}
                granularity={alertingMetricsGranularity}
                threshold={thresholdWithSeasonality}
                timeThreshold={alertConfig.timeThreshold}
              />
            )}
          />
        </div>
        <div className={locals.sectionWrapper}>
          <DescriptionItem title="Domain">
            <div className={locals.domainContentWrapper}>
              <TagFilterListPresenter
                tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                  tagFilters: tagFiltersWithWebsiteId,
                  websiteLabel
                })}
                disabled
              />
            </div>
          </DescriptionItem>
        </div>
      </>
    );
  }
);

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

function getThresholdTypeWithSeasonality(thresholdRule) {
  if (thresholdRule.type === 'historicBaseline') {
    return `${thresholdRule.type}.${thresholdRule.seasonality.toUpperCase()}`;
  }
  return thresholdRule.type;
}
