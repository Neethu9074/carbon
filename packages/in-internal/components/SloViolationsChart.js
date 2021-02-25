/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import OpenEventsCountChartWrapper from 'in-events/components/OpenEventsCountChartWrapper';
import { MINIMUM_ROLLUP, getDefaultMetricRollupDuration } from 'in-stores/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';

export default function SloViolationsChart({
  timeConfig,
  cardTitle = t('in-internal:components.sloViolationsChart.sLOViolations')
}) {
  const granularity = getDefaultMetricRollupDuration(timeConfig).rollup || MINIMUM_ROLLUP;

  return (
    <OpenEventsCountChartWrapper
      cardTitle={cardTitle}
      timeConfig={timeConfig}
      y1={{
        renderer: Renderer.stackedArea,
        formatter: number.forcedCompact,
        labels: [
          'SREInfaSLO/SRESLO/TUSLO',
          t('in-internal:components.sloViolationsChart.devTUSLOs'),
          t('in-internal:components.sloViolationsChart.expTUSLOs')
        ],
        metricIds: ['slo', 'experimentalSlo', 'developmentSlo']
      }}
      metricsConfiguration={{
        timeConfig,
        metrics: {
          slo: {
            query: `event.text:"[SREInfaSLO]" OR event.text:"[SRESLO]" OR event.text:"[TUSLO]"`,
            granularity
          },
          experimentalSlo: {
            query: `event.text:"[ExpTUSLO]"`,
            granularity
          },
          developmentSlo: {
            query: `event.text:"[DevTUSLO]"`,
            granularity
          }
        }
      }}
    />
  );
}
