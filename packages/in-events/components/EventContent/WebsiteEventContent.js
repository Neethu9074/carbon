import React from 'react';

import { getChartTimeConfigByEvent, getTimeConfigFromEventForSnapshotRetrieval } from 'in-events/timeframe';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { createDefaultChartConfig } from 'in-new-components/Alerting/Chart/chartViewConfig';
import { alertingEventDetailsChartTimeframe } from 'in-new-components/Alerting/constants';
import getStatusCodeChartConfig from 'in-websites/alerting/data/chartConfigForStatusCode';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import AnalyzeWebsiteEventButton from 'in-events/components/AnalyzeWebsiteEventButton';
import getJsErrorsChartConfig from 'in-websites/alerting/data/chartConfigForJsErrors';
import getSlownessChartConfig from 'in-websites/alerting/data/chartConfigForSlowness';
import WebsiteAlertConfigButton from 'in-events/components/WebsiteAlertConfigButton';
import { getAlertConfigByIdAndTimestamp } from 'in-websites/api/websiteAlertConfig';
import EntityInformation from 'in-components/EntityInformation/EntityInformation';
import AlertingBarChart from 'in-new-components/Alerting/Chart/AlertingBarChart';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import AlertTypeSwitch from 'in-websites/alerting/components/AlertTypeSwitch';
import { errorCount } from 'in-websites/alerting/constants';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

import locals from 'in-events/components/EventContent/WebsiteEventContent.mless';

export default connectTo(
  ({ event }) => {
    const observables = {};
    const configId = event.getIn(['metadata', 'eventSpecificationId']);
    const configTimestamp = event.getIn(['metadata', 'alertConfigCreated']);
    observables.alertConfig = getAlertConfigByIdAndTimestamp(configId, configTimestamp);
    return observables;
  },
  function WebsiteEventContent({ event, alertConfig }) {
    if (!event || !alertConfig) {
      return null;
    }

    const entityId = event.get('entityId');
    const entityType = event.get('entityType');
    const metadata = event.get('metadata');
    const websiteLabel = metadata.get('entityLabel');
    const tagFilters = alertConfig.tagFilters;
    const sensitivity = alertConfig.threshold.deviationFactor;
    const metricName = alertConfig.rule.metricName || errorCount;
    const alertType = alertConfig.rule.alertType;
    const aggregation = alertConfig.rule.aggregation || null;
    const threshold = alertConfig.threshold;
    const granularity = alertConfig.granularity;

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
                <WebsiteAlertConfigButton alertConfig={alertConfig} />
                <AnalyzeWebsiteEventButton event={event} alertConfig={alertConfig} />
              </div>
            </Card>
          </Col>
        </Row>

        <Row withoutSideMargin>
          <Col xs>
            <Card title="Metrics">
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
                      timeThreshold: alertConfig.timeThreshold,
                      threshold: alertConfig.threshold,
                      viewConfig: chartViewConfig,
                      tagFilters,
                      granularity,
                      metricName
                    })}
                  />
                )}
                renderSlowness={() => (
                  <AlertingBarChart
                    chartConfigForBlueprint={getSlownessChartConfig({
                      timeThreshold: alertConfig.timeThreshold,
                      viewConfig: chartViewConfig,
                      websiteId: entityId,
                      sensitivity,
                      tagFilters,
                      aggregation,
                      granularity,
                      threshold
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
                    tagFilters: [getWebsiteIdTagFilter(entityId), ...tagFilters],
                    websiteLabel
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
