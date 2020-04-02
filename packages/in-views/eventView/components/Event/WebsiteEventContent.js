import React from 'react';

import {
  errorCount,
  alertingMetricsGranularity,
  alertingEventDetailsChartTimeframe
} from 'in-websites/alerting/constants';
import { getChartTimeConfigByEvent, getTimeConfigFromEventForSnapshotRetrieval } from 'in-events/timeframe';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import StatusCodeAlertingBarChart from 'in-websites/alerting/chart/StatusCodeAlertingBarChart';
import JsErrorsAlertingBarChart from 'in-websites/alerting/chart/JsErrorsAlertingBarChart';
import SlownessAlertingBarChart from 'in-websites/alerting/chart/SlownessAlertingBarChart';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import AnalyzeWebsiteEventButton from 'in-events/components/AnalyzeWebsiteEventButton';
import WebsiteAlertConfigButton from 'in-events/components/WebsiteAlertConfigButton';
import { getAlertConfigByIdAndTimestamp } from 'in-websites/api/websiteAlertConfig';
import EntityInformation from 'in-components/EntityInformation/EntityInformation';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import AlertTypeSwitch from 'in-websites/alerting/components/AlertTypeSwitch';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

import locals from './WebsiteEventContent.mless';

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
    const tagFiltersWithWebsiteId = [getWebsiteIdTagFilter(entityId), ...tagFilters];
    const sensitivity = alertConfig.threshold.deviationFactor;
    const metricName = alertConfig.rule.metricName || errorCount;
    const alertType = alertConfig.rule.alertType;
    const aggregation = alertConfig.rule.aggregation || null;
    const threshold = alertConfig.threshold;
    const thresholdWithSeasonality = { ...threshold, type: getThresholdTypeWithSeasonality(threshold) };

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
            <WebsiteAlertConfigButton alertConfig={alertConfig} />
          </Card>

          <Card title="Metrics">
            <div className={locals.analyzeButtonWrapper}>
              <AnalyzeWebsiteEventButton event={event} alertConfig={alertConfig} />
            </div>
            <AlertTypeSwitch
              alertType={alertType}
              renderJsErrors={() => (
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
              renderStatusCode={() => (
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
              renderSlowness={() => (
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
          </Card>

          <Card title="Scope">
            <div className={locals.filterList}>
              <TagFilterListPresenter
                tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                  tagFilters: tagFiltersWithWebsiteId,
                  websiteLabel
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
