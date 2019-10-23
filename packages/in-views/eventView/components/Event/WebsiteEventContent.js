import React from 'react';

import AlertingConfigurationButton from 'in-events/components/legacy/AlertingConfigurationButton';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import AnalyzeJsErrorsButton from 'in-events/components/legacy/AnalyzeJsErrorsButton';
import EumAlertingBarChart from 'in-websites/eum-alerting/chart/EumAlertingBarChart';
import { getAlertConfigByIdAndTimestamp } from 'in-websites/api/websiteAlertConfig';
import EntityInformation from 'in-components/EntityInformation/EntityInformation';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

import locals from './WebsiteEventContent.mless';

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
    const tagFiltersWithWebsiteId = [getWebsiteIdTagFilter(entityId), ...alertConfig.tagFilters];
    const thresholdValue = alertConfig.threshold.value;
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

          <Card title="# of JS Errors">
            <div className={locals.analyzeButtonWrapper}>
              <AnalyzeJsErrorsButton
                timeConfigFromEvent={timeConfigFromEvent}
                tagFilters={[getErrorMessageTagFilter(alertConfig.rule), ...tagFiltersWithWebsiteId]}
                websiteLabel={websiteLabel}
              />
            </div>
            <EumAlertingBarChart
              threshold={thresholdValue}
              timeConfig={timeConfig}
              tagFilters={[getErrorMessageTagFilter(alertConfig.rule), ...tagFiltersWithWebsiteId]}
            />
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
