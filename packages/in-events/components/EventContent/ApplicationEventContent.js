/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Map } from 'immutable';
import React from 'react';

import { Card } from '@instana/components';

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
import { getChartTimeConfigByEvent, getTimeConfigFromEvent } from 'in-events/timeframe';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { alertingEventDetailsChartTimeframe } from 'in-alerting/components/constants';
import useApplicationEventEntity from 'in-events/hooks/useApplicationEventEntity';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import { getSmartAlertAnalyzeTimeframe } from 'in-events/timeframe';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

import locals from './ApplicationEventContent.mless';

export default function ApplicationEventContent({ event }) {
  const alertConfig = useApplicationEventAlertConfig(event);
  const eventEntity = useApplicationEventEntity(event);

  if (!eventEntity || !alertConfig) {
    return null;
  }

  const isGlobalSmartAlert = event.getIn(['metadata', 'globalSmartAlert'], false);
  const adaptiveBaselineInfo = event.getIn(['metadata', 'adaptiveBaselineInfo'], Map({}))?.toJS() ?? {};

  const { applicationId } = eventEntity;
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

  const isEndpointType = event.get('entityType') === 'Endpoint20';

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
              <ApplicationAlertConfigButton
                applicationId={applicationId}
                alertConfig={alertConfig}
                isGlobalSmartAlert={isGlobalSmartAlert}
              />
              <AnalyzeApplicationEventButton
                {...eventEntity}
                alertConfig={alertConfig}
                timeConfig={analyzeTimeConfig}
                adaptiveBaselineInfo={adaptiveBaselineInfo}
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
              applicationId={eventEntity.applicationId}
              serviceId={eventEntity.serviceId}
              endpointId={eventEntity.endpointId}
              eventBasedAdaptiveBaseline={Object.entries(adaptiveBaselineInfo)}
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

      {!isEndpointType && (
        <Row withoutSideMargin>
          <Col xs>
            <SmartAlertAffectedEntities {...eventEntity} alertConfig={alertConfig} event={event} />
          </Col>
        </Row>
      )}
    </>
  );
}
