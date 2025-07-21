/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

// @ts-expect-error needs migration to TS
import WebsiteDashboardsMarkerLanes from 'in-websites/WebsiteDashboard/components/WebsiteDashboardsMarkerLanes';
// @ts-expect-error needs migration to TS
import { extendMetricConfigurationOnLiveMode } from 'in-websites/metrics';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import { MetricData } from 'in-custom-dashboards/widgets/Chart/types';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { chartColors } from 'in-themes/chartColors';
import { Result, TimeConfig } from 'in-types';
import { t } from 'in-i18n';

interface UsersChartProps {
  timeConfig: TimeConfig;
  websiteId: string;
}

export default function UsersChart({ timeConfig, websiteId }: UsersChartProps) {
  const granularity = getChartGranularity(timeConfig);
  const MarkerLanes = WebsiteDashboardsMarkerLanes({ websiteId });
  //! TODO: Update this with the backend endpoint once ready
  const tagFilters = [
    {
      name: 'beacon.website.id',
      operator: 'EQUALS',
      stringValue: 'KExRPJGcSvOjBPD_JrwAIA'
    }
  ];
  const metricConfig = {
    tagFilters,
    timeConfig,
    metrics: {
      pageLoads: {
        metric: 'pageLoads',
        granularity: granularity,
        aggregation: 'SUM'
      }
    }
  };
  const placeholderResult = useObservable(getWebsiteMetrics(extendMetricConfigurationOnLiveMode(metricConfig)), [
    timeConfig
  ]);
  if (!placeholderResult) return null;

  return (
    <>
      <ChartWrapper
        renderPostChartContent={MarkerLanes}
        result={placeholderResult as unknown as Result<MetricData>}
        title={t('in-websites:websiteDashboard.tabs.businessMonitoring.usersChartTitle')}
        granularity={granularity}
        timeConfig={timeConfig}
        y1={{
          colors: [chartColors.strokeColors100[13]],
          renderer: Renderer.stackedBar,
          labels: [t('in-websites:websiteDashboard.tabs.businessMonitoring.usersChartTotalLabel')],
          metricIds: ['pageLoads'],
          metrics: []
        }}
      />
    </>
  );
}
