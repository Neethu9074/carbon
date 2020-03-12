import React from 'react';

import {
  alertingMetricsGranularity,
  alertingEventDetailsChartTimeframe,
  errorRate
} from 'in-applications/alerting/constants';
import ErrorRateAlertingBarChart from 'in-applications/alerting/chart/ErrorRateAlertingBarChart';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import AnalyzeApplicationEventButton from 'in-events/components/AnalyzeApplicationEventButton';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-applications/tags';
import ApplicationAlertConfigButton from 'in-events/components/ApplicationAlertConfigButton';
import { getAlertConfigByIdAndTimestamp } from 'in-websites/api/websiteAlertConfig';
import AlertTypeSwitch from 'in-applications/alerting/components/AlertTypeSwitch';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import { DescriptionItem } from 'in-components/DescriptionList';
import connectTo from 'in-hoc/connectTo';

import locals from './ApplicationEventListItemContent.mless';

export default connectTo(
  ({ event }) => {
    const observables = {};
    const configId = event.getIn(['metadata', 'eventSpecificationId']);
    const configTimestamp = event.getIn(['metadata', 'alertConfigCreated']);
    observables.alertConfig = getAlertConfigByIdAndTimestamp(configId, configTimestamp);
    return observables;
  },
  function ApplicationEventListItemContent({ event, alertConfig }) {
    if (!event || !alertConfig) {
      return null;
    }

    const entityId = event.get('entityId');
    const metadata = event.get('metadata');
    const applicationName = metadata.get('entityLabel');
    const tagFilters = alertConfig.tagFilters;
    const tagFiltersWithApplicationId = [getApplicationIdTagFilter(entityId), ...tagFilters];
    const operator = alertConfig.threshold.operator;
    const alertType = alertConfig.rule.alertType;
    const threshold = alertConfig.threshold;

    const timeConfig = getChartTimeConfigByEvent({ event });
    timeConfig.windowSize = alertingEventDetailsChartTimeframe;

    return (
      <>
        <ProblemDescription event={event} />
        <ApplicationAlertConfigButton alertConfig={alertConfig} />
        <div className={locals.sectionWrapper}>
          <div className={locals.analyzeButtonWrapper}>
            <AnalyzeApplicationEventButton event={event} alertConfig={alertConfig} />
          </div>
          <AlertTypeSwitch
            alertType={alertType}
            ErrorRateComponent={() => (
              <ErrorRateAlertingBarChart
                applicationId={entityId}
                operator={operator}
                timeConfig={timeConfig}
                tagFilters={tagFilters}
                granularity={alertingMetricsGranularity}
                metricName={errorRate}
                threshold={threshold}
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
                  tagFilters: tagFiltersWithApplicationId,
                  applicationName
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

function getApplicationIdTagFilter(applicationId) {
  return {
    name: 'application.id',
    operator: 'EQUALS',
    stringValue: applicationId
  };
}
