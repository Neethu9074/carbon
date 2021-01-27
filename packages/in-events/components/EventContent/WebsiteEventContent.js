/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getChartTimeConfigByEvent, getTimeConfigFromEvent } from 'in-events/timeframe';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { getEnhancedTagFilters } from 'in-new-components/Alerting/utils/tagfilterEnrichmentUtil';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { createDefaultChartConfig } from 'in-new-components/Alerting/Chart/chartViewConfig';
import { alertingEventDetailsChartTimeframe } from 'in-new-components/Alerting/constants';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import AnalyzeWebsiteEventButton from 'in-events/components/AnalyzeWebsiteEventButton';
import WebsiteAlertConfigButton from 'in-events/components/WebsiteAlertConfigButton';
import useWebsiteEventAlertConfig from 'in-events/hooks/useWebsiteEventAlertConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import WebsiteScopePath from 'in-websites/alerting/components/WebsiteScopePath';
import { getBlueprintConfig } from 'in-websites/alerting/data/blueprintConfig';
import AlertingChart from 'in-new-components/Alerting/Chart/AlertingChart';
import useWebsiteEventEntity from 'in-events/hooks/useWebsiteEventEntity';
import { getSmartAlertAnalyzeTimeframe } from 'in-events/timeframe';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';

import locals from 'in-events/components/EventContent/WebsiteEventContent.mless';

export default function WebsiteEventContent({ event }) {
  const eventEntity = useWebsiteEventEntity(event);
  const alertConfig = useWebsiteEventAlertConfig(event);

  if (!eventEntity || !alertConfig) {
    return null;
  }

  const tagFilters = alertConfig.tagFilters;
  const alertType = alertConfig.rule.alertType;
  const timeConfig = {
    ...getChartTimeConfigByEvent({ event }),
    windowSize: alertingEventDetailsChartTimeframe
  };
  const analyzeTimeConfig = getSmartAlertAnalyzeTimeframe(event, alertConfig);
  const chartViewConfig = createDefaultChartConfig(timeConfig);
  const blueprintConfig = getBlueprintConfig(alertType);

  // TODO enrichedTagFilterFormModel is always undefined here at the moment. In Website SmartAlerts, we don't
  //      fully support QB2 yet.
  const { numeratorFilter, enrichedTagFilters, enrichedTagFilterFormModel } = getEnhancedTagFilters(
    alertConfig,
    blueprintConfig
  );

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title="Description">
            <WebsiteScopePath {...eventEntity} timeConfig={getTimeConfigFromEvent(event)} showDashboardLinks />

            <ProblemDescription event={event} className="in-event-view-event-content" />
            <DescriptionButtons>
              <WebsiteAlertConfigButton alertConfig={alertConfig} />
              <AnalyzeWebsiteEventButton
                alertConfig={alertConfig}
                websiteName={eventEntity.websiteName}
                timeConfig={analyzeTimeConfig}
              />
            </DescriptionButtons>
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <Card title="Metrics">
            <AlertingChart
              alertConfigWithFormModel={{
                ...alertConfig,
                tagFilterExpression: enrichedTagFilterFormModel
              }}
              viewConfig={chartViewConfig}
              blueprintConfig={blueprintConfig}
              numeratorFilter={numeratorFilter}
              enrichedTagFilters={enrichedTagFilters}
              enrichedTagFilterExpression={toBackendQueryModel(enrichedTagFilterFormModel)}
              isQB1only
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
                  tagFilters: [...blueprintConfig.getEntityTagFilters(alertConfig), ...tagFilters],
                  websiteLabel: eventEntity.websiteName
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
