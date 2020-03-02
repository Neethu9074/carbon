import React from 'react';

import {
  alertingMetricsGranularity,
  alertingEventDetailsChartTimeframe,
  errorRate
} from 'in-applications/alerting/constants';
import { getChartTimeConfigByEvent, getTimeConfigFromEventForSnapshotRetrieval } from 'in-events/timeframe';
import ErrorRateAlertingBarChart from 'in-applications/alerting/chart/ErrorRateAlertingBarChart';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import AnalyzeApplicationEventButton from 'in-events/components/AnalyzeApplicationEventButton';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-applications/tags';
import ApplicationAlertConfigButton from 'in-events/components/ApplicationAlertConfigButton';
import { getAlertConfigByIdAndTimestamp } from 'in-applications/api/applicationAlertConfig';
import EntityInformation from 'in-components/EntityInformation/EntityInformation';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import ChartSwitch from 'in-applications/alerting/components/ChartSwitch';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

import locals from './ApplicationEventContent.mless';

const chartTitleByMetric = Object.freeze({
  [errorRate]: 'Error Rate'
});

export default connectTo(
  ({ event }) => {
    const observables = {};
    const configId = event.getIn(['metadata', 'eventSpecificationId']);
    const configTimestamp = event.getIn(['metadata', 'alertConfigCreated']);
    observables.alertConfig = getAlertConfigByIdAndTimestamp(configId, configTimestamp);
    return observables;
  },
  function ApplicationEventContent({ event, alertConfig }) {
    if (!event || !alertConfig) {
      return null;
    }

    const entityId = event.get('entityId');
    const entityType = event.get('entityType');
    const metadata = event.get('metadata');
    const applicationName = metadata.get('entityLabel');
    const tagFilters = alertConfig.tagFilters;
    const tagFiltersWithApplicationId = [getApplicationIdTagFilter(entityId), ...tagFilters];
    const thresholdValue = alertConfig.threshold.value;
    const operator = alertConfig.threshold.operator;
    const metricName = errorRate;
    const alertType = alertConfig.rule.alertType;

    const timeConfig = getChartTimeConfigByEvent({ event });
    timeConfig.windowSize = alertingEventDetailsChartTimeframe;
    return (
      <Row>
        <Col xs>
          <Card title="Details">
            <EntityInformation
              entityId={entityId}
              entityType={entityType}
              metadata={metadata}
              timeConfig={getTimeConfigFromEventForSnapshotRetrieval(event)}
            />

            <ProblemDescription event={event} className="in-event-view-event-content" />
            <ApplicationAlertConfigButton alertConfig={alertConfig} />
          </Card>

          <Card title={getChartTitle(metricName)}>
            <div className={locals.analyzeButtonWrapper}>
              <AnalyzeApplicationEventButton event={event} alertConfig={alertConfig} />
            </div>
            <ChartSwitch
              alertType={alertType}
              ErrorRateComponent={() => (
                <ErrorRateAlertingBarChart
                  applicationId={entityId}
                  threshold={thresholdValue}
                  operator={operator}
                  timeConfig={timeConfig}
                  tagFilters={tagFilters}
                  granularity={alertingMetricsGranularity}
                  metricName={metricName}
                />
              )}
            />
          </Card>

          <Card title="Scope">
            <div className={locals.filterList}>
              <TagFilterListPresenter
                tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                  tagFilters: tagFiltersWithApplicationId,
                  applicationName
                })}
                disabled
              />
            </div>
          </Card>
        </Col>
      </Row>
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

function getChartTitle(metricName) {
  return chartTitleByMetric[metricName] || '';
}
