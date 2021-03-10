/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ReadOnlyIncludeInternalOrSyntheticCallsSwitch from 'in-alerting/smart-alerts/applications/advanced/IncludeInternalOrSyntheticCallsSwitch/ReadOnlyIncludeInternalOrSyntheticCallsSwitch';
import ApplicationAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/applications/chart/ApplicationAlertingChartWithErrorMessage';
import ReadOnlyInboundOrAllCalls from 'in-alerting/smart-alerts/applications/advanced/InboundOutboundCallsSwitch/ReadOnlyInboundOrAllCalls';
import { SmartAlertAffectedEntities } from 'in-events/components/EventContent/SmartAlertAffectedEntities';
import ApplicationScopePath from 'in-alerting/smart-alerts/applications/components/ApplicationScopePath';
import AlertQueryBuilder from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import AnalyzeApplicationEventButton from 'in-events/components/AnalyzeApplicationEventButton';
import ApplicationAlertConfigButton from 'in-events/components/ApplicationAlertConfigButton';
import useApplicationEventAlertConfig from 'in-events/hooks/useApplicationEventAlertConfig';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { getChartTimeConfigByEvent, getTimeConfigFromEvent } from 'in-events/timeframe';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import { alertingEventDetailsChartTimeframe } from 'in-alerting/components/constants';
import useApplicationEventEntity from 'in-events/hooks/useApplicationEventEntity';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import { getSmartAlertAnalyzeTimeframe } from 'in-events/timeframe';
import { Col, Row } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';
import { t } from 'in-i18n';

import locals from './ApplicationEventContent.mless';

export default function ApplicationEventContent({ event }) {
  const alertConfig = useApplicationEventAlertConfig(event);
  const eventEntity = useApplicationEventEntity(event);

  if (!eventEntity || !alertConfig) {
    return null;
  }

  const { tagFilterExpression, rule, boundaryScope } = alertConfig;
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
          <Card title={t('in-events:titleDetails')}>
            <ApplicationScopePath
              {...eventEntity}
              boundaryScope={boundaryScope}
              timeConfig={getTimeConfigFromEvent(event)}
              showDashboardLinks
            />

            <ProblemDescription event={event} />
            <DescriptionButtons>
              <ApplicationAlertConfigButton alertConfig={alertConfig} />
              <AnalyzeApplicationEventButton
                {...eventEntity}
                alertConfig={alertConfig}
                timeConfig={analyzeTimeConfig}
              />
            </DescriptionButtons>
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleMetrics')}>
            <ApplicationAlertingChartWithErrorMessage
              alertConfigWithFormModel={{
                ...alertConfig,
                tagFilterExpression: tagFilterFormModel
              }}
              viewConfig={chartViewConfig}
              blueprintConfig={blueprintConfig}
              serviceId={eventEntity.serviceId}
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
                scopePath={<ApplicationScopePath boundaryScope={alertConfig.boundaryScope} {...eventEntity} />}
              />
            </div>
            <ReadOnlyInboundOrAllCalls alertConfig={alertConfig} />
            <ReadOnlyIncludeInternalOrSyntheticCallsSwitch alertConfig={alertConfig} />
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <SmartAlertAffectedEntities {...eventEntity} alertConfig={alertConfig} event={event} />
        </Col>
      </Row>
    </>
  );
}
