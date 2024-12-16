/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Map } from 'immutable';
import React from 'react';

import { TagFilterExpressionElementUnion, TagFilterOperator } from '@instana/types/typeDefinitions';
import { TagFilterExpression } from '@instana/types';
import { Card } from '@instana/components';

// @ts-expect-error
import EntityWithParentInformation from 'in-events/components/EntityInformation/EntityWithParentInformation';
import AnalyzeEntityCountVerificationEventButton from 'in-events/components/AnalyzeEntityCountVerificationEventButton';
import TriggeredIncidentButton from 'in-events/components/tabs/Summary/common/TriggeredIncidentButton';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { getChartTimeConfigByEvent, getTimeConfigFromEvent } from 'in-events/timeframe';
import EventSpecificationLink from 'in-events/components/legacy/EventSpecificationLink';
import { alertingEventDetailsChartTimeframe } from 'in-alerting/components/constants';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import AutomationCard from 'in-automation/AutomationCard/AutomationCard';
import { hasInfrastructureAnalyzeAccess } from 'in-stores/permission';
import { Config } from 'in-custom-dashboards/widgets/Chart/types';
import { EVENT_TYPES, getEventType } from 'in-stores/events';
import { numberCompact } from 'in-stores/metric/formatters';
import { getMetricDefinition } from 'in-sdk/metrics';
import { Row, Col } from 'in-components/layout/Grid';
import { line } from 'in-stores/metric/renderer';
import { EventOrMap } from 'in-events/types';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

interface Props {
  event: EventOrMap;
  snapshot: Map<string, unknown>;
}

export default function EntityCountVerificationEventContent({ event, snapshot }: Props) {
  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');
  const eventType = getEventType(event);
  const isIssue = eventType === EVENT_TYPES.ISSUE_WARNING || eventType === EVENT_TYPES.ISSUE_CRITICAL;
  const hasEventSpec = event.getIn(['metadata', 'eventSpecificationId'], '') !== '';
  const fqdn = event.getIn(['metadata', 'fqdn'], '');

  const matchingEntityType = event.getIn(['metadata', 'matching_entity_type'], '');
  const matchingOperator = event.getIn(['metadata', 'matching_operator'], '');
  const matchingEntityLabel = event.getIn(['metadata', 'matching_entity_label'], '');

  const timeConfig = {
    ...getChartTimeConfigByEvent(event),
    windowSize: alertingEventDetailsChartTimeframe
  } as TimeConfig;

  const tagFilterExpression: TagFilterExpression = {
    type: 'EXPRESSION',
    logicalOperator: 'AND',
    elements: [
      {
        type: 'TAG_FILTER',
        name: 'host.fqdn',
        operator: 'EQUALS',
        entity: NOT_APPLICABLE,
        value: fqdn
      },
      {
        type: 'TAG_FILTER',
        name: 'label',
        operator: toTagFilterOperator(matchingOperator),
        entity: NOT_APPLICABLE,
        value: matchingEntityLabel
      }
    ]
  };

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')}>
            <EntityWithParentInformation
              entityId={event.get('entityId')}
              entityType={event.get('entityType')}
              metadata={event.get('metadata')}
              timeConfig={timeConfig}
              linkTimeConfig={getTimeConfigFromEvent(event as EventOrMap)}
            />

            <ProblemDescription fixSuggestion={fixSuggestion} />

            {hasInfrastructureAnalyzeAccess && (
              <DescriptionButtons>
                <TriggeredIncidentButton event={event} />
                <EventSpecificationLink event={event.toJS()} />
                <AnalyzeEntityCountVerificationEventButton
                  tagFilterExpression={tagFilterExpression}
                  entityType={matchingEntityType}
                  timeConfig={timeConfig}
                />
              </DescriptionButtons>
            )}
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <Chart entityType={matchingEntityType} timeConfig={timeConfig} tagFilterExpression={tagFilterExpression} />
        </Col>
      </Row>

      {hasEventSpec && isIssue && (
        <AutomationCard
          volatileId={(snapshot?.get('volatileId') as Map<string, unknown>)?.toJS() ?? {}}
          event={event?.toJS()}
        />
      )}
    </>
  );
}

function toTagFilterOperator(stringMatchingOperator: string): TagFilterOperator {
  switch (stringMatchingOperator) {
    case 'is':
      return 'EQUALS';
    case 'startsWith':
      return 'STARTS_WITH';
    case 'endsWith':
      return 'ENDS_WITH';
    case 'contains':
      return 'CONTAINS';
    default:
      return 'EQUALS';
  }
}

interface ChartProps {
  timeConfig: TimeConfig;
  entityType: string;
  tagFilterExpression: TagFilterExpressionElementUnion;
}

function Chart({ entityType, timeConfig, tagFilterExpression }: ChartProps) {
  const metricDefinition = getMetricDefinition(entityType, 'count');

  const metricLabel = metricDefinition.getLabel();

  const chartConfig = {
    granularity: 30000,
    type: 'TIME_SERIES',
    y1: {
      formatter: numberCompact.id,
      min: 0,
      renderer: line.id,
      metrics: [
        {
          aggregation: 'MEAN',
          label: metricLabel,
          metric: 'count',
          source: 'INFRASTRUCTURE_METRICS',
          tagFilterExpression: tagFilterExpression,
          timeShift: 0,
          type: entityType,
          crossSeriesAggregation: 'DISTINCT_COUNT',
          allowedCrossSeriesAggregations: ['DISTINCT_COUNT'],
          dataSource: 'analytics'
        }
      ]
    }
  } as Config;

  return (
    <UnifiedMetricsChart
      title={t('in-events:titleMetrics')}
      config={chartConfig}
      timeConfig={timeConfig}
      customHeight={182}
      nonInteractive
    />
  );
}
