/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Card } from '@instana/components';

import { getSmartAlertAnalyzeTimeConfig } from 'in-events/components/EventContent/analyzeUtils';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { alertingEventDetailsChartTimeframe } from 'in-alerting/components/constants';
import AnalyzeInfraEventButton from 'in-events/components/AnalyzeInfraEventButton';
import useInfraEventAlertConfig from 'in-events/hooks/useInfraEventAlertConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { NumberFormatterObject } from 'in-services/formatters/number';
import { hasInfrastructureAnalyzeAccess } from 'in-stores/permission';
import { Config } from 'in-custom-dashboards/widgets/Chart/types';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import { getFormatterId } from 'in-stores/metric/formatters';
import { InfraAlertConfig, TimeConfig } from 'in-types';
import { EventMap, EventOrMap } from 'in-events/types';
import { getMetricDefinition } from 'in-sdk/metrics';
import { Row, Col } from 'in-components/layout/Grid';
import PluginIcon from 'in-components/PluginIcon';
import { line } from 'in-stores/metric/renderer';
import { t } from 'in-i18n';

import locals from './InfraEventContent.mless';

interface Props {
  event: EventMap;
}

export default function InfraEventContent({ event }: Props) {
  const alertConfig = useInfraEventAlertConfig(event);

  if (!alertConfig) {
    return null;
  }

  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');
  const entityName = event.getIn(['metadata', 'entityName'], '');
  const entityType = alertConfig.rule.entityType;

  const timeConfig = {
    ...getChartTimeConfigByEvent(event),
    windowSize: alertingEventDetailsChartTimeframe
  } as TimeConfig;

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')}>
            <HorizontalFlexWrapper>
              <PluginIcon className={locals.icon} size="s" plugin={entityType} />
              {t('in-events:infraSmartAlerts.pseudoAggregatedEntityLabel', { entityName: entityName })}
            </HorizontalFlexWrapper>

            <ProblemDescription fixSuggestion={fixSuggestion} className="in-event-view-event-content" />

            {hasInfrastructureAnalyzeAccess && (
              <DescriptionButtons>
                <AnalyzeInfraEventButton
                  alertConfig={alertConfig}
                  timeConfig={getSmartAlertAnalyzeTimeConfig(event as EventOrMap, alertConfig)}
                />
              </DescriptionButtons>
            )}
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <Chart alertConfig={alertConfig} timeConfig={timeConfig} />
        </Col>
      </Row>
    </>
  );
}

interface ChartProps {
  alertConfig: InfraAlertConfig;
  timeConfig: TimeConfig;
}

function Chart({ alertConfig, timeConfig }: ChartProps) {
  const { entityType, metricName, aggregation } = alertConfig.rule;

  const metricDefinition = getMetricDefinition(entityType, metricName);

  const metricLabel = metricDefinition.getLabel();
  // Because the chart config for UnifiedMetricsChart requires a string formatterId (e.g. 'percentage.compact'),
  // which is then internally mapped to the formatter function, we need to do a tiny workaround here and map the formatter
  // function to that ID, just that it's internally mapped back to the function once again.
  const metricFormatterId = getFormatterId((metricDefinition.formatter as NumberFormatterObject).detailed);

  const chartConfig = {
    type: 'TIME_SERIES',
    granularity: alertConfig.granularity,
    y1: {
      formatter: metricFormatterId,
      min: 0,
      renderer: line.id,
      metrics: [
        {
          aggregation: aggregation,
          label: metricLabel,
          metric: metricName,
          source: 'INFRASTRUCTURE_METRICS',
          tagFilterExpression: alertConfig.tagFilterExpression,
          timeShift: 0,
          type: entityType
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
