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
import {
  getSmartAlertAnalyzeTimeConfig,
  extendWindowSizeForLateData
} from 'in-events/components/EventContent/analyzeUtils';
import { getQueryBuilderForAlertType } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import { eumImpactedUsersForAppAlertEnabled, businessObservabilityEnabled } from 'in-services/featureFlags';
import { SmartAlertAffectedEntities } from 'in-events/components/EventContent/SmartAlertAffectedEntities';
import ApplicationScopePath from 'in-alerting/smart-alerts/applications/components/ApplicationScopePath';
import TriggeredIncidentButton from 'in-events/components/tabs/Summary/common/TriggeredIncidentButton';
import { HighlightDataRetention } from 'in-events/components/EventContent/HighlightDataRetention';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import SmartAlertImpactedUsers from 'in-events/components/EventContent/SmartAlertImpactedUsers';
import AnalyzeApplicationEventButton from 'in-events/components/AnalyzeApplicationEventButton';
import ManualCloseIssueButton from 'in-events/components/tabs/Summary/ManualCloseIssueButton';
import ApplicationAlertConfigButton from 'in-events/components/ApplicationAlertConfigButton';
import useApplicationEventAlertConfig from 'in-events/hooks/useApplicationEventAlertConfig';
import { hasManualCloseFields, getEventStateBadge } from 'in-events/components/eventUtil';
import { getChartTimeConfigByEvent, getTimeConfigFromEvent } from 'in-events/timeframe';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import ManualCloseDescription from 'in-events/components/legacy/ManualCloseDescription';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import ImpactedBusinessProcesses from 'in-events/components/ImpactedBusinessProcesses';
import { isApproximatePrecision } from 'in-events/components/util/metricResultUtil';
import useApplicationEventEntity from 'in-events/hooks/useApplicationEventEntity';
import { getWindowSizeFromEvent } from 'in-alerting/components/Chart/chartUtils';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import AutomationCard from 'in-automation/AutomationCard/AutomationCard';
import { getEventSeverityLabelWithEventType } from 'in-stores/events';
import { emptyMap } from 'in-services/fixedImmutables';
import EventIcon from 'in-events/components/EventIcon';
import { Col, Row } from 'in-components/layout/Grid';
import { getEventType } from 'in-stores/events';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './ApplicationEventContent.mless';

export default function ApplicationEventContent({ event, snapshot, reload }) {
  const alertConfig = useApplicationEventAlertConfig(event);
  const eventEntity = useApplicationEventEntity(event);
  const [metricResultPrecision, setMetricResultPrecision] = useState();

  if (!eventEntity || !alertConfig) {
    return <LoadingIndicator size="xxxl" />;
  }

  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');
  const isGlobalSmartAlert = event.getIn(['metadata', 'globalSmartAlert'], false);
  const adaptiveBaselineInfo = event.getIn(['metadata', 'adaptiveBaselineInfo'], emptyMap).toJS();

  const { applicationId } = eventEntity;
  const { tagFilterExpression, rule, boundaryScope, threshold, granularity } = alertConfig;
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

  const extendedDashboardTimeConfig = extendWindowSizeForLateData(getTimeConfigFromEvent(event), granularity);
  const extendedAnalyzeTimeConfig = extendWindowSizeForLateData(
    getSmartAlertAnalyzeTimeConfig(event, alertConfig),
    granularity
  );

  const chartViewConfig = createDefaultChartConfig(timeConfig);

  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  const isEndpointType = event.get('entityType') === 'Endpoint20';

  const eventType = getEventType(event);

  const canCloseManually = role?.canManuallyCloseIssue;
  const pillContent = getEventStateBadge(event);
  const isKPI = false;

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')} leftHeaderContent={pillContent}>
            <ApplicationScopePath
              {...eventEntity}
              boundaryScope={boundaryScope}
              timeConfig={extendedDashboardTimeConfig}
              showDashboardLinks
            />
            <ProblemDescription fixSuggestion={fixSuggestion} />
            {canCloseManually && hasManualCloseFields(event) ? (
              <div>
                <ManualCloseDescription event={event} />
                <DescriptionButtons>
                  <TriggeredIncidentButton event={event} />
                  <ApplicationAlertConfigButton
                    applicationId={applicationId}
                    alertConfig={alertConfig}
                    isGlobalSmartAlert={isGlobalSmartAlert}
                  />
                  <AnalyzeApplicationEventButton
                    {...eventEntity}
                    alertConfig={alertConfig}
                    timeConfig={extendedAnalyzeTimeConfig}
                    adaptiveBaselineInfo={adaptiveBaselineInfo}
                  />
                </DescriptionButtons>
              </div>
            ) : (
              <DescriptionButtons>
                {canCloseManually && (
                  <ManualCloseIssueButton
                    event={event}
                    reload={reload}
                    iconComponent={
                      <EventIcon event={event} tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)} />
                    }
                  />
                )}
                <TriggeredIncidentButton event={event} />
                <ApplicationAlertConfigButton
                  applicationId={applicationId}
                  alertConfig={alertConfig}
                  isGlobalSmartAlert={isGlobalSmartAlert}
                />
                <AnalyzeApplicationEventButton
                  {...eventEntity}
                  alertConfig={alertConfig}
                  timeConfig={extendedAnalyzeTimeConfig}
                  adaptiveBaselineInfo={adaptiveBaselineInfo}
                />
              </DescriptionButtons>
            )}
          </Card>
        </Col>
      </Row>

      {eumImpactedUsersForAppAlertEnabled && (
        <Row withoutSideMargin>
          <Col xs>
            <SmartAlertImpactedUsers
              alertConfig={alertConfig}
              event={event}
              eventEntity={eventEntity}
              snapshot={snapshot}
              isKPI={isKPI}
            />
          </Col>
        </Row>
      )}

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
      <AutomationCard volatileId={snapshot?.get('volatileId')?.toJS() ?? {}} event={event?.toJS()} />
      {businessObservabilityEnabled && (
        <ImpactedBusinessProcesses
          eventType={eventType}
          entityType={event?.get('entityType', undefined)}
          entityId={event?.get('entityId', undefined)}
        />
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
