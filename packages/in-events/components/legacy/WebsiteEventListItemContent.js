import React from 'react';

import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { alertingEventDetailsChartTimeframe } from 'in-new-components/Alerting/constants';
import getStatusCodeChartConfig from 'in-websites/alerting/data/chartConfigForStatusCode';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import AnalyzeWebsiteEventButton from 'in-events/components/AnalyzeWebsiteEventButton';
import getJsErrorsChartConfig from 'in-websites/alerting/data/chartConfigForJsErrors';
import getSlownessChartConfig from 'in-websites/alerting/data/chartConfigForSlowness';
import WebsiteAlertConfigButton from 'in-events/components/WebsiteAlertConfigButton';
import { getAlertConfigByIdAndTimestamp } from 'in-websites/api/websiteAlertConfig';
import AlertingBarChart from 'in-new-components/Alerting/Chart/AlertingBarChart';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import AlertTypeSwitch from 'in-websites/alerting/components/AlertTypeSwitch';
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
    const sensitivity = alertConfig.threshold.deviationFactor;
    const metricName = alertConfig.rule.metricName || 'errors';
    const alertType = alertConfig.rule.alertType;
    const aggregation = alertConfig.rule.aggregation || null;
    const threshold = alertConfig.threshold;
    const granularity = alertConfig.granularity;

    const timeConfig = getChartTimeConfigByEvent({ event });
    timeConfig.windowSize = alertingEventDetailsChartTimeframe;

    const chartViewConfig = {
      timeConfig
    };
    return (
      <>
        <ProblemDescription event={event} />
        <WebsiteAlertConfigButton alertConfig={alertConfig} />
        <div className={locals.sectionWrapper}>
          <div className={locals.analyzeButtonWrapper}>
            <AnalyzeWebsiteEventButton event={event} alertConfig={alertConfig} />
          </div>
          <AlertTypeSwitch
            alertType={alertType}
            renderJsErrors={() => (
              <AlertingBarChart
                chartConfigForBlueprint={getJsErrorsChartConfig({
                  websiteId: entityId,
                  viewConfig: chartViewConfig,
                  errorFilter: getErrorMessageTagFilter(alertConfig.rule),
                  threshold: alertConfig.threshold,
                  timeThreshold: alertConfig.timeThreshold,
                  tagFilters,
                  granularity,
                  metricName
                })}
              />
            )}
            renderStatusCode={() => (
              <AlertingBarChart
                chartConfigForBlueprint={getStatusCodeChartConfig({
                  websiteId: entityId,
                  numeratorFilter: getStatusCodeTagFilter(alertConfig.rule),
                  viewConfig: chartViewConfig,
                  threshold: alertConfig.threshold,
                  timeThreshold: alertConfig.timeThreshold,
                  tagFilters,
                  granularity,
                  metricName
                })}
              />
            )}
            renderSlowness={() => (
              <AlertingBarChart
                chartConfigForBlueprint={getSlownessChartConfig({
                  websiteId: entityId,
                  timeThreshold: alertConfig.timeThreshold,
                  viewConfig: chartViewConfig,
                  aggregation,
                  granularity,
                  tagFilters,
                  threshold,
                  sensitivity
                })}
              />
            )}
          />
        </div>
        <div className={locals.sectionWrapper}>
          <DescriptionItem title="Domain">
            <div className={locals.domainContentWrapper}>
              <TagFilterListPresenter
                tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                  tagFilters: [getWebsiteIdTagFilter(entityId), ...tagFilters],
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
