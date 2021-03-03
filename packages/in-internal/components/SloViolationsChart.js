/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import OpenEventsCountChartWrapper from 'in-events/components/OpenEventsCountChartWrapper';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getInfraGranularity } from 'in-stores/metric';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function SloViolationsChart({
  timeConfig,
  cardTitle = t('in-internal:components.sloViolationsChart.sLOViolations')
}) {
  const granularity = getInfraGranularity(timeConfig);

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
