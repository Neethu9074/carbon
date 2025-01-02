/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// import ReactDOMServer from 'react-dom/server';
import { Map } from 'immutable';
import React from 'react';

import { Card } from '@instana/components';

import TriggeredIncidentButton from 'in-events/components/tabs/Summary/common/TriggeredIncidentButton';
import SyntheticScopePath from 'in-alerting/smart-alerts/synthetics/components/SyntheticScopePath';
import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import AnalyzeSyntheticEventButton from 'in-events/components/AnalyzeSyntheticEventButton';
import SyntheticsAlertconfigButton from 'in-events/components/SyntheticsAlertconfigButton';
import { hasManualCloseFields, getEventStateBadge } from 'in-events/components/eventUtil';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import ManualCloseDescription from 'in-events/components/legacy/ManualCloseDescription';
import { getChartTimeConfigByEvent, getTimeConfigFromEvent } from 'in-events/timeframe';
import useSyntheticEventAlertConfig from 'in-events/hooks/useSyntheticEventAlertConfig';
import { locationIdTagName, statusTagName, testIdTagName } from 'in-synthetics/tags';
import { TimeConfig, TagFilterExpressionElementUnion, TagFilter } from 'in-types';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import ManualCloseIssueButton from '../tabs/Summary/ManualCloseIssueButton';
import AutomationCard from 'in-automation/AutomationCard/AutomationCard';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getEventSeverityLabelWithEventType } from 'in-stores/events';
import { manuallyCloseEventEnabled } from 'in-services/featureFlags';
import { fixateTimeConfig } from 'in-stores/time/config';
import EventIcon from 'in-events/components/EventIcon';
import { number } from 'in-services/formatters/number';
import { EventMap, EventOrMap } from 'in-events/types';
import { Row, Col } from 'in-components/layout/Grid';
import { bar } from 'in-stores/metric/renderer';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

interface Props {
  event: EventOrMap;
  snapshot: Map<string, unknown>;
  reload: () => void;
}

export default function SyntheticEventContent({ event, snapshot, reload }: Props) {
  const alertConfig = useSyntheticEventAlertConfig(event);

  if (!alertConfig) {
    return <LoadingIndicator size="xxxl" />;
  }

  const { tagFilterExpression } = alertConfig;
  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '') as string;
  const syntheticTestId = event.getIn(['metadata', 'syntheticTestId']) as string;
  const syntheticTestLabel = event.getIn(['metadata', 'entityLabel'], '') as string;
  const locationId = event.getIn(['metadata', 'locations', 0, 'id']) as string;
  const locationLabel = event.getIn(['metadata', 'locations', 0, 'label']) as string;
  const syntheticTestInterval = event.getIn(['metadata', 'syntheticTestInterval']) as number;
  const eventTimeConfig = getTimeConfigFromEvent(event as EventOrMap);
  const analyzeTimeConfig = fixateTimeConfig(eventTimeConfig);
  const chartTimeConfigWithContext = getChartTimeConfig(event, syntheticTestInterval);

  const canCloseManually = manuallyCloseEventEnabled && role?.canManuallyCloseIssue;
  const pillContent = getEventStateBadge(event);

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')} leftHeaderContent={pillContent}>
            <SyntheticScopePath
              syntheticTestId={syntheticTestId}
              syntheticTestLabel={syntheticTestLabel}
              locationLabel={locationLabel}
            />
            <ProblemDescription fixSuggestion={fixSuggestion} />
            {canCloseManually && hasManualCloseFields(event) ? (
              <div>
                <ManualCloseDescription event={event} />
                <DescriptionButtons>
                  <TriggeredIncidentButton event={event} />
                  <SyntheticsAlertconfigButton alertConfig={alertConfig} />
                  <AnalyzeSyntheticEventButton
                    testId={syntheticTestId}
                    locationId={locationId}
                    locationLabel={locationLabel}
                    timeConfig={analyzeTimeConfig}
                    syntheticTestLabel={syntheticTestLabel}
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
                      <EventIcon
                        event={event}
                        tooltipLabel={getEventSeverityLabelWithEventType(event, eventTimeConfig)}
                      />
                    }
                  />
                )}
                <TriggeredIncidentButton event={event} />
                <SyntheticsAlertconfigButton alertConfig={alertConfig} />
                <AnalyzeSyntheticEventButton
                  testId={syntheticTestId}
                  locationId={locationId}
                  locationLabel={locationLabel}
                  timeConfig={analyzeTimeConfig}
                  syntheticTestLabel={syntheticTestLabel}
                />
              </DescriptionButtons>
            )}
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <FailuresChart
            testId={syntheticTestId}
            locationId={locationId}
            timeConfig={chartTimeConfigWithContext}
            granularity={syntheticTestInterval}
            tagFilterExpression={tagFilterExpression}
          />
        </Col>
      </Row>
      <AutomationCard
        volatileId={(snapshot?.get('volatileId') as Map<string, unknown>)?.toJS() ?? {}}
        event={event?.toJS()}
      />
    </>
  );
}

function getChartTimeConfig(event: EventMap, syntheticTestInterval: number): TimeConfig {
  const chartTimeConfig = getChartTimeConfigByEvent(event);
  return {
    ...chartTimeConfig,
    autoRefresh: false,
    // We extend the window size a little to give more context, as well as to ensure the chart does not just contain 1 bucket,
    // which looks very odd. But not always at least 12 hours, because that's probably too much context, and distracts from the
    // relevant part as long as we do not highlight that region properly.
    windowSize: chartTimeConfig.windowSize + syntheticTestInterval * 10
  } as TimeConfig;
}

interface ChartProps {
  testId: string;
  locationId: string;
  timeConfig: TimeConfig;
  granularity?: number;
  tagFilterExpression: TagFilterExpressionElementUnion;
}

function FailuresChart({ testId, locationId, timeConfig, granularity, tagFilterExpression }: ChartProps) {
  const combinedExpression = toCombinedExpression(testId, locationId, tagFilterExpression);

  return (
    <UnifiedMetricsChart
      title={t('in-synthetics:dashboard.summary.widgets.failures')}
      config={{
        y1: {
          metrics: [
            {
              aggregation: 'DISTINCT_COUNT',
              source: 'SYNTHETICS',
              metric: 'id',
              label: t('in-events:syntheticSmartAlerts.failedStatusMetric'),
              tagFilterExpression: combinedExpression
            }
          ],
          formatter: 'number.compact',
          tooltipFormatter: number.compact,
          renderer: bar.id
        },
        type: 'TIME_SERIES',
        granularity
      }}
      timeConfig={timeConfig}
      customHeight={182}
      nonInteractive
    />
  );
}

function toCombinedExpression(
  testId: string,
  locationId: string,
  tagFilterExpression: TagFilterExpressionElementUnion
): TagFilterExpressionElementUnion {
  const tagFilters = [
    {
      type: 'TAG_FILTER',
      name: testIdTagName,
      operator: EQUALS,
      value: testId,
      entity: 'NOT_APPLICABLE'
    },
    {
      type: 'TAG_FILTER',
      name: statusTagName,
      operator: EQUALS,
      value: 0,
      entity: 'NOT_APPLICABLE'
    },
    {
      type: 'TAG_FILTER',
      name: locationIdTagName,
      operator: EQUALS,
      value: locationId,
      entity: 'NOT_APPLICABLE'
    }
  ] as TagFilter[];

  return addTagFilters(tagFilterExpression, tagFilters);
}
