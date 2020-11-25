import React from 'react';

import {
  getChartTimeConfigByEvent,
  getTimeConfigFromEvent,
  getTimeConfigFromEventForSnapshotRetrieval
} from 'in-events/timeframe';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { createDefaultChartConfig } from 'in-new-components/Alerting/Chart/chartViewConfig';
import { alertingEventDetailsChartTimeframe } from 'in-new-components/Alerting/constants';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import EntityInformation from 'in-events/components/EntityInformation/EntityInformation';
import AnalyzeWebsiteEventButton from 'in-events/components/AnalyzeWebsiteEventButton';
import WebsiteAlertConfigButton from 'in-events/components/WebsiteAlertConfigButton';
import { getAlertConfigByIdAndTimestamp } from 'in-websites/api/websiteAlertConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import { getBlueprintConfig } from 'in-websites/alerting/data/blueprintConfig';
import AlertingChart from 'in-new-components/Alerting/Chart/AlertingChart';
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
    const alertType = alertConfig.rule.alertType;

    const timeConfig = {
      ...getChartTimeConfigByEvent({ event }),
      windowSize: alertingEventDetailsChartTimeframe
    };
    const chartViewConfig = createDefaultChartConfig(timeConfig);
    const blueprintConfig = getBlueprintConfig(alertType);

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
                linkTimeConfig={getTimeConfigFromEvent(event)}
              />

              <ProblemDescription event={event} className="in-event-view-event-content" />
              <DescriptionButtons>
                <WebsiteAlertConfigButton alertConfig={alertConfig} />
                <AnalyzeWebsiteEventButton event={event} alertConfig={alertConfig} />
              </DescriptionButtons>
            </Card>
          </Col>
        </Row>

        <Row withoutSideMargin>
          <Col xs>
            <Card title="Metrics">
              <AlertingChart alertConfig={alertConfig} viewConfig={chartViewConfig} blueprintConfig={blueprintConfig} />
            </Card>
          </Col>
        </Row>

        <Row withoutSideMargin>
          <Col xs>
            <Card title="Scope">
              <div className={locals.filterList}>
                <TagFilterListPresenter
                  tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                    tagFilters: [blueprintConfig.getEntityTagFilter(alertConfig), ...tagFilters],
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
