import React from 'react';

import { getChartTimeConfigByEvent, getTimeConfigFromEventForSnapshotRetrieval } from 'in-events/timeframe';
import StatusCodeAlertingBarChart from 'in-applications/alerting/chart/StatusCodeAlertingBarChart';
import ErrorRateAlertingBarChart from 'in-applications/alerting/chart/ErrorRateAlertingBarChart';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import AnalyzeApplicationEventButton from 'in-events/components/AnalyzeApplicationEventButton';
import SlownessAlertingBarChart from 'in-applications/alerting/chart/SlownessAlertingBarChart';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-applications/tags';
import ApplicationAlertConfigButton from 'in-events/components/ApplicationAlertConfigButton';
import { createDefaultChartConfig } from 'in-new-components/Alerting/Chart/chartViewConfig';
import { getAlertConfigByIdAndTimestamp } from 'in-applications/api/applicationAlertConfig';
import { alertingEventDetailsChartTimeframe } from 'in-new-components/Alerting/constants';
import LogsAlertingBarChart from 'in-applications/alerting/chart/LogsAlertingBarChart';
import { getApplicationIdTagFilter } from 'in-applications/alerting/tagFilterUtils';
import AlertTypeSwitch from 'in-applications/alerting/components/AlertTypeSwitch';
import EntityInformation from 'in-components/EntityInformation/EntityInformation';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

import locals from './ApplicationEventContent.mless';

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
    const { boundaryScope, tagFilters, threshold, rule, timeThreshold, granularity } = alertConfig;
    const sensitivity = threshold.deviationFactor;
    const operator = threshold.operator;
    const alertType = rule.alertType;
    const aggregation = rule.aggregation;

    const timeConfig = {
      ...getChartTimeConfigByEvent({ event }),
      windowSize: alertingEventDetailsChartTimeframe
    };
    const chartViewConfig = createDefaultChartConfig(timeConfig);

    return (
      <>
        <Row withoutSideMargin>
          <Col xs>
            <Card title="Description">
              <EntityInformation
                entityId={entityId}
                entityType={entityType}
                metadata={metadata}
                timeConfig={getTimeConfigFromEventForSnapshotRetrieval(event)}
              />

              <ProblemDescription event={event} className="in-event-view-event-content" />
              <ApplicationAlertConfigButton alertConfig={alertConfig} />
            </Card>
          </Col>
        </Row>

        <Row withoutSideMargin>
          <Col xs>
            <Card title="Metrics">
              <div className={locals.analyzeButtonWrapper}>
                <AnalyzeApplicationEventButton event={event} alertConfig={alertConfig} />
              </div>
              <AlertTypeSwitch
                alertType={alertType}
                renderErrorRate={() => (
                  <ErrorRateAlertingBarChart
                    applicationId={entityId}
                    boundaryScope={boundaryScope}
                    operator={operator}
                    tagFilters={tagFilters}
                    viewConfig={chartViewConfig}
                    granularity={granularity}
                    threshold={threshold}
                    timeThreshold={timeThreshold}
                  />
                )}
                renderSlowness={() => (
                  <SlownessAlertingBarChart
                    applicationId={entityId}
                    boundaryScope={boundaryScope}
                    sensitivity={sensitivity}
                    tagFilters={tagFilters}
                    viewConfig={chartViewConfig}
                    aggregation={aggregation}
                    granularity={granularity}
                    threshold={threshold}
                    timeThreshold={timeThreshold}
                  />
                )}
                renderLogs={() => (
                  <LogsAlertingBarChart
                    applicationId={entityId}
                    boundaryScope={boundaryScope}
                    logMessage={rule.message}
                    logMessageOperator={rule.operator}
                    logLevel={rule.level}
                    operator={operator}
                    viewConfig={chartViewConfig}
                    tagFilters={tagFilters}
                    granularity={granularity}
                    threshold={threshold}
                    timeThreshold={timeThreshold}
                  />
                )}
                renderStatusCode={() => (
                  <StatusCodeAlertingBarChart
                    applicationId={entityId}
                    statusCodeStart={rule.statusCodeStart}
                    statusCodeEnd={rule.statusCodeEnd}
                    operator={operator}
                    viewConfig={chartViewConfig}
                    tagFilters={tagFilters}
                    granularity={granularity}
                    threshold={threshold}
                    timeThreshold={timeThreshold}
                  />
                )}
              />
            </Card>
          </Col>
        </Row>

        <Row withoutSideMargin>
          <Col xs>
            <Card title="Scope">
              <div className={locals.filterList}>
                <TagFilterListPresenter
                  tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                    applicationName,
                    tagFilters: [getApplicationIdTagFilter({ entityId, boundaryScope }), ...tagFilters]
                  })}
                  disabled
                />
              </div>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
);
