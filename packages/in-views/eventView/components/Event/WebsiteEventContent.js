import React from 'react';

import AlertingConfigurationButton from 'in-events/components/legacy/AlertingConfigurationButton';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import JsErrorsAlertingBarChart from 'in-websites/eum-alerting/chart/JsErrorsAlertingBarChart';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import EumAlertingBarChart from 'in-websites/eum-alerting/chart/EumAlertingBarChart';
import { getAlertConfigByIdAndTimestamp } from 'in-websites/api/websiteAlertConfig';
import EntityInformation from 'in-components/EntityInformation/EntityInformation';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import ChartSwitch from 'in-websites/eum-alerting/components/ChartSwitch';
import EumAlertButton from 'in-events/components/legacy/EumAlertButton';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

import locals from './WebsiteEventContent.mless';

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
  function WebsiteEventContent({ event, timeConfigFromEvent, alertConfig }) {
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
    const thresholdType = alertConfig.threshold.type;
    const metricName = alertConfig.rule.metricName || 'errors';
    const alertType = alertConfig.rule.alertType;
    const aggregation = alertConfig.rule.aggregation || null;
    const operator = alertConfig.rule.operator;

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
              timeConfig={timeConfigFromEvent}
            />

            <ProblemDescription event={event} className="in-event-view-event-content" />
            <AlertingConfigurationButton alertConfig={alertConfig} websiteLabel={websiteLabel} />
          </Card>

          <Card title={getChartTitle(alertType)}>
            <div className={locals.analyzeButtonWrapper}>
              <EumAlertButton
                timeConfigFromEvent={timeConfigFromEvent}
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
                  thresholdType={thresholdType}
                  threshold={thresholdValue}
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

function getChartTitle(alertType) {
  if (alertType === alertTypes.specificJsError) {
    return '# of JS Errors';
  }
  return 'On Load time';
}
