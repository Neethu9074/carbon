import React from 'react';

import { getChartTimeConfigByEvent, getTimeConfigFromEventForSnapshotRetrieval } from 'in-events/timeframe';
import { SmartAlertAffectedEntities } from 'in-events/components/EventContent/SmartAlertAffectedEntities';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import AnalyzeApplicationEventButton from 'in-events/components/AnalyzeApplicationEventButton';
import getStatusCodeChartConfig from 'in-applications/alerting/data/chartConfigForStatusCode';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-applications/tags';
import ApplicationAlertConfigButton from 'in-events/components/ApplicationAlertConfigButton';
import { createDefaultChartConfig } from 'in-new-components/Alerting/Chart/chartViewConfig';
import { getAlertConfigByIdAndTimestamp } from 'in-applications/api/applicationAlertConfig';
import getErrorRateChartConfig from 'in-applications/alerting/data/chartConfigForErrorRate';
import { alertingEventDetailsChartTimeframe } from 'in-new-components/Alerting/constants';
import getSlownessChartConfig from 'in-applications/alerting/data/chartConfigForSlowness';
import { getApplicationIdTagFilter } from 'in-applications/alerting/tagFilterUtils';
import AlertTypeSwitch from 'in-applications/alerting/components/AlertTypeSwitch';
import EntityInformation from 'in-components/EntityInformation/EntityInformation';
import getLogsChartConfig from 'in-applications/alerting/data/chartConfigForLogs';
import AlertingBarChart from 'in-new-components/Alerting/Chart/AlertingBarChart';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import { Col, Row } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

import locals from 'in-events/components/EventContent/ApplicationEventContent.mless';

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
              <div className={locals.descriptionButtonGroup}>
                <ApplicationAlertConfigButton alertConfig={alertConfig} />
                <AnalyzeApplicationEventButton event={event} alertConfig={alertConfig} />
              </div>
            </Card>
          </Col>
        </Row>

        <Row withoutSideMargin>
          <Col xs>
            <Card title="Metrics">
              <AlertTypeSwitch
                alertType={alertType}
                renderErrorRate={() => (
                  <AlertingBarChart
                    chartConfigForBlueprint={getErrorRateChartConfig({
                      applicationId: entityId,
                      viewConfig: chartViewConfig,
                      boundaryScope,
                      tagFilters,
                      granularity,
                      threshold,
                      timeThreshold
                    })}
                  />
                )}
                renderSlowness={() => (
                  <AlertingBarChart
                    chartConfigForBlueprint={getSlownessChartConfig({
                      applicationId: entityId,
                      viewConfig: chartViewConfig,
                      boundaryScope,
                      sensitivity,
                      tagFilters,
                      aggregation,
                      granularity,
                      threshold,
                      timeThreshold
                    })}
                  />
                )}
                renderLogs={() => (
                  <AlertingBarChart
                    chartConfigForBlueprint={getLogsChartConfig({
                      applicationId: entityId,
                      logMessage: rule.message,
                      logMessageOperator: rule.operator,
                      logLevel: rule.level,
                      viewConfig: chartViewConfig,
                      boundaryScope,
                      tagFilters,
                      granularity,
                      threshold,
                      timeThreshold
                    })}
                  />
                )}
                renderStatusCode={() => (
                  <AlertingBarChart
                    chartConfigForBlueprint={getStatusCodeChartConfig({
                      applicationId: entityId,
                      statusCodeStart: rule.statusCodeStart,
                      statusCodeEnd: rule.statusCodeEnd,
                      viewConfig: chartViewConfig,
                      tagFilters,
                      granularity,
                      threshold,
                      timeThreshold,
                      boundaryScope
                    })}
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

        <Row withoutSideMargin>
          <Col xs>
            <SmartAlertAffectedEntities alertConfig={alertConfig} event={event} />
          </Col>
        </Row>
      </>
    );
  }
);
