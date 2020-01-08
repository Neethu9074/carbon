import React from 'react';

import AlertingConfigurationButton from 'in-events/components/legacy/AlertingConfigurationButton';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import JsErrorsAlertingBarChart from 'in-websites/eum-alerting/chart/JsErrorsAlertingBarChart';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import { getChartTimeConfigByEvent, getTimeConfigFromEvent } from 'in-events/timeframe';
import EumAlertingBarChart from 'in-websites/eum-alerting/chart/EumAlertingBarChart';
import { getAlertConfigByIdAndTimestamp } from 'in-websites/api/websiteAlertConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import ChartSwitch from 'in-websites/eum-alerting/components/ChartSwitch';
import EumAlertButton from 'in-events/components/legacy/EumAlertButton';
import { DescriptionItem } from 'in-components/DescriptionList';
import connectTo from 'in-hoc/connectTo';

import locals from './WebsiteEventListItemContent.mless';

const tenMins = 10 * 1000 * 60;
const twelveHours = 1000 * 60 * 60 * 12;

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
    const baseline = alertConfig.threshold.baseline;
    const thresholdValue = alertConfig.threshold.value;
    const operator = alertConfig.threshold.operator;
    const metricName = alertConfig.rule.metricName || 'errors';
    const alertType = alertConfig.rule.alertType;
    const aggregation = alertConfig.rule.aggregation || null;

    const timeConfig = getChartTimeConfigByEvent({ event });
    timeConfig.windowSize = twelveHours;

    return (
      <>
        <ProblemDescription event={event} />
        <AlertingConfigurationButton alertConfig={alertConfig} websiteLabel={websiteLabel} />
        <div className={locals.sectionWrapper}>
          <div className={locals.analyzeButtonWrapper}>
            <EumAlertButton
              timeConfig={getTimeConfigFromEvent(event)}
              tagFilters={[getErrorMessageTagFilter(alertConfig.rule), ...tagFiltersWithWebsiteId]}
              websiteLabel={websiteLabel}
              alertType={alertType}
            />
          </div>
          <ChartSwitch
            alertType={alertType}
            JsErrorsComponent={() => (
              <JsErrorsAlertingBarChart
                websiteId={entityId}
                threshold={thresholdValue}
                operator={operator}
                timeConfig={timeConfig}
                tagFilters={tagFilters}
                errorFilter={getErrorMessageTagFilter(alertConfig.rule)}
                granularity={tenMins}
                metricName={metricName}
              />
            )}
            SlownessComponent={() => (
              <EumAlertingBarChart
                websiteId={entityId}
                thresholdType={getThresholdTypeWithSeasonality(alertConfig.threshold)}
                threshold={thresholdValue}
                operator={operator}
                sensitivity={sensitivity}
                baseline={baseline}
                timeConfig={timeConfig}
                tagFilters={tagFiltersWithWebsiteId}
                aggregation={aggregation}
                granularity={tenMins}
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

function getThresholdTypeWithSeasonality(thresholdRule) {
  if (thresholdRule.type === 'historicBaseline') {
    return `${thresholdRule.type}.${thresholdRule.seasonality.toUpperCase()}`;
  }
  return thresholdRule.type;
}
