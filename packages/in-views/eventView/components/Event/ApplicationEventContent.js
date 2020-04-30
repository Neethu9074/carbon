import React from 'react';

import {
  alertingMetricsGranularity,
  alertingEventDetailsChartTimeframe
} from 'in-new-components/Alerting/utils/timeConfigUtils';
import { getChartTimeConfigByEvent, getTimeConfigFromEventForSnapshotRetrieval } from 'in-events/timeframe';
import ErrorRateAlertingBarChart from 'in-applications/alerting/chart/ErrorRateAlertingBarChart';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import AnalyzeApplicationEventButton from 'in-events/components/AnalyzeApplicationEventButton';
import SlownessAlertingBarChart from 'in-applications/alerting/chart/SlownessAlertingBarChart';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-applications/tags';
import ApplicationAlertConfigButton from 'in-events/components/ApplicationAlertConfigButton';
import { getAlertConfigByIdAndTimestamp } from 'in-applications/api/applicationAlertConfig';
import LogsAlertingBarChart from 'in-applications/alerting/chart/LogsAlertingBarChart';
import AlertTypeSwitch from 'in-applications/alerting/components/AlertTypeSwitch';
import EntityInformation from 'in-components/EntityInformation/EntityInformation';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

import locals from './ApplicationEventContent.mless';
import StatusCodeAlertingBarChart from '../../../../in-applications/alerting/chart/StatusCodeAlertingBarChart';

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
    const sensitivity = alertConfig.threshold.deviationFactor;
    const operator = alertConfig.threshold.operator;
    const alertType = alertConfig.rule.alertType;
    const aggregation = alertConfig.rule.aggregation;
    const threshold = alertConfig.threshold;
    const timeThreshold = alertConfig.timeThreshold;

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

          <Card title="Metrics">
            <div className={locals.analyzeButtonWrapper}>
              <AnalyzeApplicationEventButton event={event} alertConfig={alertConfig} />
            </div>
            <AlertTypeSwitch
              alertType={alertType}
              renderErrorRate={() => (
                <ErrorRateAlertingBarChart
                  applicationId={entityId}
                  operator={operator}
                  timeConfig={timeConfig}
                  tagFilters={tagFilters}
                  granularity={alertingMetricsGranularity}
                  threshold={threshold}
                  timeThreshold={timeThreshold}
                />
              )}
              renderSlowness={() => (
                <SlownessAlertingBarChart
                  applicationId={entityId}
                  sensitivity={sensitivity}
                  timeConfig={timeConfig}
                  tagFilters={tagFilters}
                  aggregation={aggregation}
                  granularity={alertingMetricsGranularity}
                  threshold={threshold}
                  timeThreshold={timeThreshold}
                />
              )}
              renderLogs={() => (
                <LogsAlertingBarChart
                  applicationId={entityId}
                  logMessage={alertConfig.rule.message}
                  logMessageOperator={alertConfig.rule.operator}
                  logLevel={alertConfig.rule.level}
                  operator={operator}
                  timeConfig={timeConfig}
                  tagFilters={tagFilters}
                  granularity={alertingMetricsGranularity}
                  threshold={threshold}
                  timeThreshold={timeThreshold}
                />
              )}
              renderStatusCode={() => (
                <StatusCodeAlertingBarChart
                  applicationId={entityId}
                  statusCodeStart={alertConfig.rule.statusCodeStart}
                  statusCodeEnd={alertConfig.rule.statusCodeEnd}
                  operator={operator}
                  timeConfig={timeConfig}
                  tagFilters={tagFilters}
                  granularity={alertingMetricsGranularity}
                  threshold={threshold}
                  timeThreshold={timeThreshold}
                />
              )}
            />
          </Card>

          <Card title="Scope">
            <div className={locals.filterList}>
              <TagFilterListPresenter
                tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                  tagFilters: [getApplicationIdTagFilter(entityId), ...tagFilters],
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
