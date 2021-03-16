/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import WebsitesAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/websites/chart/WebsitesAlertingChartWithErrorMessage';
import AlertQueryBuilder from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import WebsiteScopePath from 'in-alerting/smart-alerts/websites/components/WebsiteScopePath';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { getChartTimeConfigByEvent, getTimeConfigFromEvent } from 'in-events/timeframe';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import AnalyzeWebsiteEventButton from 'in-events/components/AnalyzeWebsiteEventButton';
import { alertingEventDetailsChartTimeframe } from 'in-alerting/components/constants';
import WebsiteAlertConfigButton from 'in-events/components/WebsiteAlertConfigButton';
import useWebsiteEventAlertConfig from 'in-events/hooks/useWebsiteEventAlertConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import useWebsiteEventEntity from 'in-events/hooks/useWebsiteEventEntity';
import { getSmartAlertAnalyzeTimeframe } from 'in-events/timeframe';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';
import { t } from 'in-i18n';

import locals from 'in-events/components/EventContent/WebsiteEventContent.mless';

export default function WebsiteEventContent({ event }) {
  const eventEntity = useWebsiteEventEntity(event);
  const alertConfig = useWebsiteEventAlertConfig(event);

  if (!eventEntity || !alertConfig) {
    return null;
  }

  const { tagFilterExpression, rule } = alertConfig;
  const alertType = rule.alertType;

  const blueprintConfig = getBlueprintConfig(alertType);
  const timeConfig = {
    ...getChartTimeConfigByEvent({ event }),
    windowSize: alertingEventDetailsChartTimeframe
  };
  const analyzeTimeConfig = getSmartAlertAnalyzeTimeframe(event, alertConfig);
  const chartViewConfig = createDefaultChartConfig(timeConfig);

  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')}>
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
          <Card title={t('in-events:titleMetrics')}>
            <WebsitesAlertingChartWithErrorMessage
              alertConfigWithFormModel={{
                ...alertConfig,
                tagFilterExpression: tagFilterFormModel
              }}
              viewConfig={chartViewConfig}
              blueprintConfig={blueprintConfig}
            />
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleScope')}>
            <div className={locals.alertFiltersWrapper}>
              <ScopeConfigPresenter
                tagFilterFormModel={tagFilterFormModel}
                queryBuilder={<AlertQueryBuilder value={tagFilterFormModel} readOnly />}
                scopePath={<WebsiteScopePath {...eventEntity} />}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}
