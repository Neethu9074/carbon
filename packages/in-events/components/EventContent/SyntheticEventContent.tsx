/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Card } from '@instana/components';

import SyntheticScopePath from 'in-alerting/smart-alerts/synthetics/components/SyntheticScopePath';
import AnalyzeSyntheticEventButton from 'in-events/components/AnalyzeSyntheticEventButton';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { getChartTimeConfigByEvent, getTimeConfigFromEvent } from 'in-events/timeframe';
import useSyntheticEventAlertConfig from 'in-events/hooks/useSyntheticEventAlertConfig';
import { TimeConfig, TagFilterExpressionElementUnion, TagFilter } from 'in-types';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { fixateTimeConfig } from 'in-stores/time/config';
import { number } from 'in-services/formatters/number';
import { EventMap, EventOrMap } from 'in-events/types';
import { Row, Col } from 'in-components/layout/Grid';
import { bar } from 'in-stores/metric/renderer';
import { t } from 'in-i18n';

interface Props {
  event: EventMap;
}

export default function SyntheticEventContent({ event }: Props) {
  const alertConfig = useSyntheticEventAlertConfig(event);

  if (!alertConfig) {
    return null;
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

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')}>
            <SyntheticScopePath
              syntheticTestId={syntheticTestId}
              syntheticTestLabel={syntheticTestLabel}
              locationLabel={locationLabel}
            />

            <ProblemDescription fixSuggestion={fixSuggestion} />

            <DescriptionButtons>
              <AnalyzeSyntheticEventButton
                testId={syntheticTestId}
                locationLabel={locationLabel}
                timeConfig={analyzeTimeConfig}
              />
            </DescriptionButtons>
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
    </>
  );
}

function getChartTimeConfig(event: EventMap, syntheticTestInterval: number): TimeConfig {
  const chartTimeConfig = getChartTimeConfigByEvent(event);
  return {
    ...chartTimeConfig,
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
  const tagFilters = toTagFiltersList(testId, locationId, tagFilterExpression);

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
              tagFilters
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

function toTagFiltersList(
  testId: string,
  locationId: string,
  tagFilterExpression: TagFilterExpressionElementUnion
): TagFilter[] {
  const tagFilters = [
    {
      type: 'TAG_FILTER',
      name: 'testId',
      operator: EQUALS,
      value: testId,
      entity: 'NOT_APPLICABLE'
    },
    {
      type: 'TAG_FILTER',
      name: 'status',
      operator: EQUALS,
      value: 0,
      entity: 'NOT_APPLICABLE'
    },
    {
      type: 'TAG_FILTER',
      name: 'locationId',
      operator: EQUALS,
      value: locationId,
      entity: 'NOT_APPLICABLE'
    }
  ] as TagFilter[];

  // TODO Use addTagFilters(...) and combine the above filters with the tagFilterExpression once the backend supports that.
  //      And then simply return the combined tagFilterExpression instead.
  const additionalTagFilters = firstLevelAndFilters(tagFilterExpression);

  return [...tagFilters, ...additionalTagFilters];
}

/**
 * As a temporary workaround, as long as the Synthetics metrics API don't yet fully support tag-filter expressions, we only
 * respect the first level of filters in case AND operator is used.
 * @param tagFilterExpression The tag-filter expression to apply a partial conversion to a list of tag-filters on.
 * @return A list of tag-filters that is equivalent to the tag-filter expression as long as no OR operator is used.
 *         Otherwise, the result might only contain a subset of the filters.
 */
function firstLevelAndFilters(tagFilterExpression: TagFilterExpressionElementUnion): TagFilter[] {
  if (tagFilterExpression.type === 'TAG_FILTER') {
    return [tagFilterExpression];
  }

  if (tagFilterExpression.logicalOperator === 'OR') {
    return [];
  }

  return tagFilterExpression.elements.filter(x => x.type === 'TAG_FILTER') as TagFilter[];
}
