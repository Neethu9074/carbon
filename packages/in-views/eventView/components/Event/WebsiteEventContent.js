import React from 'react';

import { getChartTimeConfigByEvent, getTimeConfigFromEventForSnapshotRetrieval } from 'in-events/timeframe';
import AlertingConfigurationButton from 'in-events/components/legacy/AlertingConfigurationButton';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import JsErrorsAlertingBarChart from 'in-websites/eum-alerting/chart/JsErrorsAlertingBarChart';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import EumAlertingBarChart from 'in-websites/eum-alerting/chart/EumAlertingBarChart';
import { getAlertConfigByIdAndTimestamp } from 'in-websites/api/websiteAlertConfig';
import EntityInformation from 'in-components/EntityInformation/EntityInformation';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import ChartSwitch from 'in-websites/eum-alerting/components/ChartSwitch';
import AnalyzeEumButton from 'in-events/components/legacy/AnalyzeEumButton';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

import locals from './WebsiteEventContent.mless';

const tenMins = 10 * 1000 * 60;
const twelveHours = 1000 * 60 * 60 * 12;

const chartTitleByMetric = {
  errors: '# of JS Errors',
  specificJsErrorRate: 'Rate of JS Errors',
  specificStatusCodeCount: '# of HTTP Status Codes',
  specificStatusCodeRate: 'Rate of HTTP Status Codes',
  onLoadTime: 'onLoad Time'
};

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
    const baseline = alertConfig.threshold.baseline;
    const thresholdValue = alertConfig.threshold.value;
    const operator = alertConfig.threshold.operator;
    const metricName = alertConfig.rule.metricName || 'errors';
    const alertType = alertConfig.rule.alertType;
    const aggregation = alertConfig.rule.aggregation || null;

    const timeConfig = getChartTimeConfigByEvent({ event });
    timeConfig.windowSize = twelveHours;
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
            <AlertingConfigurationButton alertConfig={alertConfig} websiteLabel={websiteLabel} />
          </Card>

          <Card title={getChartTitle(metricName)}>
            <div className={locals.analyzeButtonWrapper}>
              <AnalyzeEumButton event={event} alertConfig={alertConfig} />
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
          </Card>

          <Card title="Domain">
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

function getChartTitle(metricName) {
  if (metricName in chartTitleByMetric) {
    return chartTitleByMetric[metricName];
  }
  return '';
}

function getThresholdTypeWithSeasonality(thresholdRule) {
  if (thresholdRule.type === 'historicBaseline') {
    return `${thresholdRule.type}.${thresholdRule.seasonality.toUpperCase()}`;
  }
  return thresholdRule.type;
}
