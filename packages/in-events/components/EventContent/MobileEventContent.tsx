/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';
import { Map } from 'immutable';

import { Card } from '@instana/components';

import {
  alertingEventDetailsChartTimeframe as minDurationMillis,
  alertingDialogItemPickerTimeframe as maxDurationMillis
} from 'in-alerting/components/constants';
import MobileAppAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/mobileApp/chart/MobileAppAlertingChartWithErrorMessage';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/mobileApp/components/AlertQueryBuilder';
import { AdaptiveBaselinePredictionsInfo } from 'in-alerting/smart-alerts/data/adaptiveBaselinePredictionInfo';
import { getBlueprintConfig, MetricName } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import TriggeredIncidentButton from 'in-events/components/tabs/Summary/common/TriggeredIncidentButton';
import { HighlightDataRetention } from 'in-events/components/EventContent/HighlightDataRetention';
import MobileAppScopePath from 'in-alerting/smart-alerts/mobileApp/components/MobileAppScopePath';
import { getSmartAlertAnalyzeTimeConfig } from 'in-events/components/EventContent/analyzeUtils';
import ManualCloseIssueButton from 'in-events/components/tabs/Summary/ManualCloseIssueButton';
import AnalyzeMobileAppEventButton from 'in-events/components/AnalyzeMobileAppEventButton';
import { hasManualCloseFields, getEventStateBadge } from 'in-events/components/eventUtil';
import MobileAppAlertConfigButton from 'in-events/components/MobileAppAlertConfigButton';
import ManualCloseDescription from 'in-events/components/legacy/ManualCloseDescription';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import useMobileAppEventAlertConfig from 'in-events/hooks/useMobileAppEventAlertConfig';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { isApproximatePrecision } from 'in-events/components/util/metricResultUtil';
import { getWindowSizeFromEvent } from 'in-alerting/components/Chart/chartUtils';
import { eumImpactedUsersForWebsiteAndMobileAlertEnabled } from 'in-services/featureFlags';
import SmartAlertImpactedUsers from 'in-events/components/EventContent/SmartAlertImpactedUsers';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import useMobileAppEventEntity from 'in-events/hooks/useMobileAppEventEntity';
import AutomationCard from 'in-automation/AutomationCard/AutomationCard';
import { getEventSeverityLabelWithEventType } from 'in-stores/events';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import EventIcon from 'in-events/components/EventIcon';
import { emptyMap } from 'in-services/fixedImmutables';
import { Row, Col } from 'in-components/layout/Grid';
import { EventOrMap } from 'in-events/types';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-events/components/EventContent/MobileEventContent.mless';

interface Props {
  event: EventOrMap;
  snapshot: Map<string, unknown>;
  reload: () => void;
}

export default function MobileEventContent({ event, snapshot, reload }: Props) {
  const eventEntity = useMobileAppEventEntity(event);
  const alertConfig = useMobileAppEventAlertConfig(event);
  const [metricResultPrecision, setMetricResultPrecision] = useState<string>('');
  if (!eventEntity || !alertConfig) {
    return <LoadingIndicator size="xxxl" />;
  }
  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');
  const adaptiveBaselineInfo: AdaptiveBaselinePredictionsInfo = event
    .getIn(['metadata', 'adaptiveBaselineInfo'], emptyMap)
    .toJS();
  const { tagFilterExpression, rule } = alertConfig;
  const { alertType, metricName } = rule;
  const blueprintConfig = getBlueprintConfig(alertType);
  const beaconType = blueprintConfig.getBeaconType(metricName as MetricName);
  const AlertQueryBuilder = getQueryBuilderForBeaconType(beaconType).QueryBuilder;
  const windowSize = getWindowSizeFromEvent(event, minDurationMillis, maxDurationMillis);
  const timeConfig = {
    ...getChartTimeConfigByEvent(event),
    autoRefresh: false,
    ...(windowSize && { windowSize })
  };
  const chartViewConfig = createDefaultChartConfig(timeConfig);
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  const canCloseManually = role?.canManuallyCloseIssue;
  const pillContent = getEventStateBadge(event);
  const isKPI = false;

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')} leftHeaderContent={pillContent}>
            <MobileAppScopePath {...eventEntity} showDashboardLinks />
            <ProblemDescription fixSuggestion={fixSuggestion} />
            {canCloseManually && hasManualCloseFields(event) ? (
              <div>
                <ManualCloseDescription event={event} />
                <DescriptionButtons>
                  <TriggeredIncidentButton event={event} />
                  <MobileAppAlertConfigButton alertConfig={alertConfig} />
                  <AnalyzeMobileAppEventButton
                    mobileAppName={eventEntity.mobileAppName}
                    alertConfig={alertConfig}
                    timeConfig={getSmartAlertAnalyzeTimeConfig(event, alertConfig)}
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
                <MobileAppAlertConfigButton alertConfig={alertConfig} />
                <AnalyzeMobileAppEventButton
                  mobileAppName={eventEntity.mobileAppName}
                  alertConfig={alertConfig}
                  timeConfig={getSmartAlertAnalyzeTimeConfig(event, alertConfig)}
                />
              </DescriptionButtons>
            )}
          </Card>
        </Col>
      </Row>
      {eumImpactedUsersForWebsiteAndMobileAlertEnabled && (
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
            <MobileAppAlertingChartWithErrorMessage
              alertConfigWithFormModel={{
                ...alertConfig,
                tagFilterExpression: tagFilterFormModel
              }}
              //@ts-expect-error chartViewConfig does not need label
              viewConfig={chartViewConfig}
              blueprintConfig={blueprintConfig}
              setMetricResultPrecision={setMetricResultPrecision}
              eventBasedAdaptiveBaseline={Object.entries(adaptiveBaselineInfo)}
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
                //@ts-expect-error type error for querybuilder
                queryBuilder={<AlertQueryBuilder value={tagFilterFormModel} readOnly />}
                scopePath={<MobileAppScopePath {...eventEntity} />}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <AutomationCard
        volatileId={(snapshot?.get('volatileId') as Map<string, unknown>)?.toJS() ?? {}}
        event={event?.toJS()}
      />
    </>
  );
}
