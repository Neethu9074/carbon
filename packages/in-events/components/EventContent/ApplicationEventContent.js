/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { Card } from '@instana/components';

import ReadOnlyIncludeInternalOrSyntheticCallsSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/IncludeInternalOrSyntheticCallsSwitch/ReadOnlyIncludeInternalOrSyntheticCallsSwitch';
import {
  alertingEventDetailsChartTimeframe as minDurationMillis,
  alertingDialogItemPickerTimeframe as maxDurationMillis
} from 'in-alerting/components/constants';
import ReadOnlyInboundOrAllCalls from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/ReadOnlyInboundOrAllCalls';
import ApplicationAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/applications/chart/ApplicationAlertingChartWithErrorMessage';
import { getQueryBuilderForAlertType } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import { SmartAlertAffectedEntities } from 'in-events/components/EventContent/SmartAlertAffectedEntities';
import ApplicationScopePath from 'in-alerting/smart-alerts/applications/components/ApplicationScopePath';
import { HighlightDataRetention } from 'in-events/components/EventContent/HighlightDataRetention';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { getSmartAlertAnalyzeTimeConfig } from 'in-events/components/EventContent/analyzeUtils';
import AnalyzeApplicationEventButton from 'in-events/components/AnalyzeApplicationEventButton';
import AssociatedActionsAlerts from 'in-automation/AssociatedActions/AssociatedActionsAlerts';
import ApplicationAlertConfigButton from 'in-events/components/ApplicationAlertConfigButton';
import useApplicationEventAlertConfig from 'in-events/hooks/useApplicationEventAlertConfig';
import { getChartTimeConfigByEvent, getTimeConfigFromEvent } from 'in-events/timeframe';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { isApproximatePrecision } from 'in-events/components/util/metricResultUtil';
import useApplicationEventEntity from 'in-events/hooks/useApplicationEventEntity';
import { getWindowSizeFromEvent } from 'in-alerting/components/Chart/chartUtils';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import { actionAutomationEnabled } from 'in-services/featureFlags';
import { emptyMap } from 'in-services/fixedImmutables';
import { Col, Row } from 'in-components/layout/Grid';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './ApplicationEventContent.mless';

export default function ApplicationEventContent({ event, snapshot }) {
  const alertConfig = useApplicationEventAlertConfig(event);
  const eventEntity = useApplicationEventEntity(event);
  const [metricResultPrecision, setMetricResultPrecision] = useState();

  if (!eventEntity || !alertConfig) {
    return null;
  }

  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');
  const isGlobalSmartAlert = event.getIn(['metadata', 'globalSmartAlert'], false);
  const adaptiveBaselineInfo = event.getIn(['metadata', 'adaptiveBaselineInfo'], emptyMap).toJS();

  const { applicationId } = eventEntity;
  const { tagFilterExpression, rule, boundaryScope, threshold } = alertConfig;
  const { alertType } = rule;
  const thresholdType = threshold.type;
  const { QueryBuilder } = getQueryBuilderForAlertType(alertType, thresholdType);

  const windowSize = getWindowSizeFromEvent(event, minDurationMillis, maxDurationMillis);

  const blueprintConfig = getBlueprintConfig(alertType);

  const timeConfig = {
    ...getChartTimeConfigByEvent(event),
    autoRefresh: false,
    ...(windowSize && { windowSize })
  };

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

            <ProblemDescription fixSuggestion={fixSuggestion} />
            <DescriptionButtons>
              <ApplicationAlertConfigButton
                applicationId={applicationId}
                alertConfig={alertConfig}
                isGlobalSmartAlert={isGlobalSmartAlert}
              />
              <AnalyzeApplicationEventButton
                {...eventEntity}
                alertConfig={alertConfig}
                timeConfig={getSmartAlertAnalyzeTimeConfig(event, alertConfig)}
                adaptiveBaselineInfo={adaptiveBaselineInfo}
              />
            </DescriptionButtons>
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <Card
            title={t('in-events:titleMetrics')}
            leftHeaderContent={
              <HighlightDataRetention hasApproximateData={isApproximatePrecision(metricResultPrecision)} />
            }
          >
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
              eventBasedAdaptiveBaseline={Object.entries(adaptiveBaselineInfo).sort((a, b) => a[0] - b[0])}
              setMetricResultPrecision={setMetricResultPrecision}
              isEventsView
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
                queryBuilder={<QueryBuilder value={tagFilterFormModel} readOnly />}
                scopePath={<ApplicationScopePath boundaryScope={alertConfig.boundaryScope} {...eventEntity} />}
              />
            </div>
            <ReadOnlyInboundOrAllCalls alertConfig={alertConfig} />
            <ReadOnlyIncludeInternalOrSyntheticCallsSwitch alertConfig={alertConfig} />
          </Card>
        </Col>
      </Row>

      {!isEndpointType && <AffectedEntitiesRow alertConfig={alertConfig} event={event} eventEntity={eventEntity} />}

      {actionAutomationEnabled &&
        role.canConfigureAutomationActions &&
        role.canConfigureCustomAlerts &&
        !isGlobalSmartAlert && (
          <Row withoutSideMargin>
            <Col xs>
              <Card>
                <AssociatedActionsAlerts
                  volatileId={snapshot?.get('volatileId')?.toJS() ?? {}}
                  event={event?.toJS()}
                  alertConfig={alertConfig}
                />
              </Card>
            </Col>
          </Row>
        )}
    </>
  );
}

function AffectedEntitiesRow({ alertConfig, event, eventEntity }) {
  const [hasApproxDataForAffectedEntities, setApproxDataForAffectedEntities] = useState();

  return (
    <Row withoutSideMargin>
      <Col xs>
        <SmartAlertAffectedEntities
          leftHeaderContent={<HighlightDataRetention hasApproximateData={hasApproxDataForAffectedEntities} />}
          alertConfig={alertConfig}
          event={event}
          setApproxDataForAffectedEntities={setApproxDataForAffectedEntities}
          {...eventEntity}
        />
      </Col>
    </Row>
  );
}
