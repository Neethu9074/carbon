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
import { infraExploreDataEnabled } from 'in-services/featureFlags';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import { hasInfrastructureAccess } from 'in-stores/permission';
import { getFormatterId } from 'in-stores/metric/formatters';
import { getMetricDefinition } from 'in-sdk/metrics';
import { Row, Col } from 'in-components/layout/Grid';
import PluginIcon from 'in-components/PluginIcon';
import { t } from 'in-i18n';

import locals from './InfraEventContent.mless';

export default function InfraEventContent({ event }) {
  const alertConfig = useInfraEventAlertConfig(event);

  if (!alertConfig) {
    return null;
  }

  const entityName = event.getIn(['metadata', 'entityName'], '');
  const entityType = alertConfig.rule.entityType;

  const timeConfig = {
    ...getChartTimeConfigByEvent(event),
    windowSize: alertingEventDetailsChartTimeframe
  };

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')}>
            <HorizontalFlexWrapper>
              <PluginIcon className={locals.icon} size="s" plugin={entityType} />
              {t('in-events:infraSmartAlerts.pseudoAggregatedEntityLabel', { entityName: entityName })}
            </HorizontalFlexWrapper>

            <ProblemDescription event={event} className="in-event-view-event-content" />

            {infraExploreDataEnabled && hasInfrastructureAccess && (
              <DescriptionButtons>
                <AnalyzeInfraEventButton
                  alertConfig={alertConfig}
                  timeConfig={getSmartAlertAnalyzeTimeConfig(event, alertConfig)}
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

function Chart({ alertConfig, timeConfig }) {
  const { entityType, metricName, aggregation } = alertConfig.rule;

  const metricDefinition = getMetricDefinition(entityType, metricName);

  const metricLabel = metricDefinition.getLabel;
  // Because the chart config for UnifiedMetricsChart requires a string formatterId (e.g. 'percentage.compact'),
  // which is then internally mapped to the formatter function, we need to do a tiny workaround here and map the formatter
  // function to that ID, just that it's internally mapped back to the function once again.
  const metricFormatterId = getFormatterId(metricDefinition.formatter.detailed);

  const chartConfig = {
    type: 'TIME_SERIES',
    granularity: alertConfig.granularity,
    y1: {
      formatter: metricFormatterId,
      min: 0,
      renderer: 'line',
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
  };

  return (
    <UnifiedMetricsChart
      timeConfig={timeConfig}
      config={chartConfig}
      title={t('in-events:titleMetrics')}
      customHeight={182}
    />
  );
}
