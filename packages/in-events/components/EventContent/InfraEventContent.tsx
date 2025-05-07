/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';
import { Map } from 'immutable';

import { Card } from '@instana/components';

import {
  alertingEventDetailsChartTimeframe as minDurationMillis,
  alertingDialogItemPickerTimeframe as maxDurationMillis
} from 'in-alerting/components/constants';
import {
  getChartTimeConfigByEvent,
  getFromOfEvent,
  getTimeConfigFromEvent,
  getToOfEvent,
  minEventEntityWindowSize
} from 'in-events/timeframe';
import {
  customEvaluationType,
  perEntityEvaluationType
} from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/CustomOrPerEntityOption';
import InfraAlertChartWrapper, {
  useGetMetricLabel
} from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import { InfraAggregatedEntitiesTablePresenter } from 'in-events/components/EventContent/InfraAggregatedEntities';
// @ts-expect-error
import EntityInformation from 'in-events/components/EntityInformation/EntityInformation';
import { getQueryBuilder } from 'in-alerting/smart-alerts/infrastructure/components/AlertQueryBuilder';
import TriggeredIncidentButton from 'in-events/components/tabs/Summary/common/TriggeredIncidentButton';
import { adjustTimestamp, getWindowSizeFromEvent } from 'in-alerting/components/Chart/chartUtils';
import { getExpressionWithGroupingTags } from 'in-events/components/EventContent/tagFilterUtils';
import { getSmartAlertAnalyzeTimeConfig } from 'in-events/components/EventContent/analyzeUtils';
import InfraScopePath from 'in-alerting/smart-alerts/infrastructure/components/InfraScopePath';
import ManualCloseIssueButton from 'in-events/components/tabs/Summary/ManualCloseIssueButton';
import { ScopeGroupingTags } from 'in-events/components/EventContent/ScopeInfraGroupingTags';
import { getIconType as getInfraIconType } from 'in-infrastructure/infrastructureIconType';
import { hasManualCloseFields, getEventStateBadge } from 'in-events/components/eventUtil';
import ManualCloseDescription from 'in-events/components/legacy/ManualCloseDescription';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import AnalyzeInfraEventButton from 'in-events/components/AnalyzeInfraEventButton';
import InfraAlertConfigButton from 'in-events/components/InfraAlertConfigButton';
import useInfraEventAlertConfig from 'in-events/hooks/useInfraEventAlertConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { infraPredictiveDetectionEnabled } from 'in-services/featureFlags';
import AutomationCard from 'in-automation/AutomationCard/AutomationCard';
import { TagCatalog, TagFilterExpression, TimeConfig } from 'in-types';
import { getEventSeverityLabelWithEventType } from 'in-stores/events';
import { hasInfrastructureAnalyzeAccess } from 'in-stores/permission';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import { emptyList, emptyMap } from 'in-services/fixedImmutables';
import EventIcon from 'in-events/components/EventIcon';
import { Row, Col } from 'in-components/layout/Grid';
import { deepCopy } from 'in-services/util/object';
import { getPluginName } from 'in-sdk/pluginName';
import { EventOrMap } from 'in-events/types';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './InfraEventContent.mless';

interface Props {
  event: EventOrMap;
  snapshot: Map<string, unknown>;
  reload: () => void;
}

export default function InfraEventContent({ event, snapshot, reload }: Props) {
  const alertConfig = useInfraEventAlertConfig(event);
  const evaluationType = alertConfig?.evaluationType ?? customEvaluationType;
  const isPerEntityEvaluation = evaluationType === perEntityEvaluationType;
  const entityType = alertConfig?.rule?.entityType ?? 'all';
  const tagCatalog = useTagCatalog({ ownerType: entityType });

  const aggregation = event.getIn(['metadata', 'smartAlertInfo', 'metricAggregation'], '');
  const metricName = event.getIn(['metadata', 'smartAlertInfo', 'metricName'], '');
  const metricLabel = useGetMetricLabel(entityType, metricName, aggregation);

  const [aggregatedEntitiesOpen, setAggregatedEntitiesOpen] = useState(true);

  if (!alertConfig) {
    return <LoadingIndicator size="xxxl" />;
  }

  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');
  const entityLabel = isPerEntityEvaluation
    ? getPluginName(entityType, 1)
    : event.getIn(['metadata', 'entityLabel'], '');

  const groupingTags = event.getIn(['metadata', 'groupingTags'], emptyMap).toJS();
  const predictions = event.getIn(['metadata', 'predictions'], emptyList).toJS();
  const lowerBound = event.getIn(['metadata', 'predictionsLowerBound'], emptyList).toJS();
  const upperBound = event.getIn(['metadata', 'predictionsUpperBound'], emptyList).toJS();

  const tagFilterExpression = alertConfig.tagFilterExpression;
  const AlertQueryBuilder = getQueryBuilder(tagCatalog as TagCatalog).QueryBuilder;
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  const [ruleWithThreshold] = alertConfig.rules ?? [];
  const alertConfigWithGroupingExpression = {
    ...alertConfig,
    tagFilterExpression: {
      ...getExpressionWithGroupingTags(deepCopy(tagFilterExpression) as TagFilterExpression, groupingTags)
    }
  };

  const windowSize = getWindowSizeFromEvent(event, minDurationMillis, maxDurationMillis);

  let timeConfig = {
    ...getChartTimeConfigByEvent(event),
    autoRefresh: false,
    ...(windowSize && { windowSize })
  } as TimeConfig;

  // If the event includes predictions, the endtime is either the end date or the last timestamp in the prediction, whichever is greater.
  if (predictions?.length > 0 && infraPredictiveDetectionEnabled) {
    const predictionMaxTime = predictions[predictions.length - 1][0];
    const endTime = timeConfig?.to ? Math.max(timeConfig?.to, predictionMaxTime) : predictionMaxTime;
    timeConfig = { ...timeConfig, to: endTime, focusedMoment: endTime };
  }

  const canCloseManually = role?.canManuallyCloseIssue;
  const pillContent = getEventStateBadge(event);

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')} leftHeaderContent={pillContent} className={locals.cardPadding}>
            <div className={locals.withPadding}>
              <EntityInformation
                pathname={physicalDashboardPath}
                entityId={event.get('entityId')}
                entityType={event.get('entityType')}
                metadata={event.get('metadata')}
                timeConfig={timeConfig}
                linkTimeConfig={getTimeConfigFromEvent(event)}
                plugin={event.get('plugin')}
              />

              <ProblemDescription fixSuggestion={fixSuggestion} />
            </div>
            {alertConfig.evaluationType === customEvaluationType && (
              <InfraAggregatedEntitiesTablePresenter
                tagFilterFormModel={tagFilterFormModel}
                timeConfig={getTimeConfigForAggregatedEntitiesTable(
                  event as EventOrMap,
                  alertConfigWithGroupingExpression.granularity
                )}
                ruleWithThreshold={ruleWithThreshold}
                tagFilterExpression={alertConfigWithGroupingExpression.tagFilterExpression}
                metricLabel={metricLabel}
                aggregatedEntitiesOpen={aggregatedEntitiesOpen}
                setAggregatedEntitiesOpen={setAggregatedEntitiesOpen}
              />
            )}
            <div className={locals.withPadding}>
              {canCloseManually && hasManualCloseFields(event) ? (
                <div>
                  <ManualCloseDescription event={event} />
                  {hasInfrastructureAnalyzeAccess && (
                    <DescriptionButtons>
                      <InfraAlertConfigButton alertConfig={alertConfig} />
                      <TriggeredIncidentButton event={event} />
                      <AnalyzeInfraEventButton
                        alertConfig={alertConfigWithGroupingExpression}
                        timeConfig={getSmartAlertAnalyzeTimeConfig(event as EventOrMap, alertConfig)}
                      />
                    </DescriptionButtons>
                  )}
                </div>
              ) : (
                <div>
                  {hasInfrastructureAnalyzeAccess ? (
                    <DescriptionButtons>
                      {canCloseManually && (
                        <ManualCloseIssueButton
                          event={event}
                          reload={reload}
                          iconComponent={
                            <EventIcon
                              event={event}
                              tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)}
                            />
                          }
                        />
                      )}
                      <TriggeredIncidentButton event={event} />
                      <InfraAlertConfigButton alertConfig={alertConfig} />
                      <AnalyzeInfraEventButton
                        alertConfig={alertConfigWithGroupingExpression}
                        timeConfig={getSmartAlertAnalyzeTimeConfig(event as EventOrMap, alertConfig)}
                      />
                    </DescriptionButtons>
                  ) : (
                    <div>
                      {canCloseManually && (
                        <ManualCloseIssueButton
                          event={event}
                          reload={reload}
                          iconComponent={
                            <EventIcon
                              event={event}
                              tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)}
                            />
                          }
                        />
                      )}
                      <TriggeredIncidentButton event={event} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleMetrics')}>
            <InfraAlertChartWrapper
              alertConfig={alertConfigWithGroupingExpression}
              timeConfig={timeConfig}
              metricLabel={metricLabel}
              predictions={infraPredictiveDetectionEnabled ? predictions : []}
              lowerBound={infraPredictiveDetectionEnabled ? lowerBound : []}
              upperBound={infraPredictiveDetectionEnabled ? upperBound : []}
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
                scopePath={
                  <>
                    <InfraScopePath infraName={entityLabel} iconName={getInfraIconType(entityType as string)} />
                    <ScopeGroupingTags
                      AlertQueryBuilder={AlertQueryBuilder}
                      groupingTags={isPerEntityEvaluation ? {} : groupingTags}
                    />
                  </>
                }
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

export function getTimeConfigForAggregatedEntitiesTable(
  event: EventOrMap,
  granularity: number
): TimeConfig | undefined {
  const from = getFromOfEvent(event);
  if (!from) return undefined;
  const toForWs = adjustTimestamp(getToOfEvent(event) || Date.now(), granularity);

  return {
    to: toForWs,
    focusedMoment: toForWs,
    windowSize: Math.max(minEventEntityWindowSize, toForWs - from),
    autoRefresh: false
  };
}
