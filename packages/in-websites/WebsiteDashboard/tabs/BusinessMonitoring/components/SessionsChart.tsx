/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import Renderer from 'in-components/Chart/renderer/Renderer';
import { getChartGranularity } from 'in-stores/metric/metric';
import { Result, TimeConfig } from 'in-types';
import { chartColors } from 'in-themes/chartColors';
import React from 'react';
import { t } from 'in-i18n';
// @ts-expect-error needs migration to TS
import WebsiteDashboardsMarkerLanes from 'in-websites/WebsiteDashboard/components/WebsiteDashboardsMarkerLanes';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { MetricData } from 'in-custom-dashboards/widgets/Chart/types';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
// @ts-expect-error needs migration to TS
import { extendMetricConfigurationOnLiveMode } from 'in-websites/metrics';
import { useObservable } from '@instana/hooks';

interface SessionsChartProps {
  timeConfig: TimeConfig;
  websiteId: string;
}

export default function SessionsChart({ timeConfig, websiteId }: SessionsChartProps) {
  const granularity = getChartGranularity(timeConfig);
  const MarkerLanes = WebsiteDashboardsMarkerLanes({ websiteId });
  //! TODO: Update this with the backend endpoint once ready
  const tagFilters = [
    {
      name: "beacon.website.id",
      operator: "EQUALS",
      stringValue: "KExRPJGcSvOjBPD_JrwAIA"
    }
  ]
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
  }
  const placeholderResult = useObservable(getWebsiteMetrics(extendMetricConfigurationOnLiveMode(metricConfig)), [timeConfig]);
  if (!placeholderResult) return null;

  return (
    <>
      <ChartWrapper
        renderPostChartContent={MarkerLanes}
        result={placeholderResult as unknown as Result<MetricData>}
        title={t('in-websites:websiteDashboard.tabs.businessMonitoring.sessionsChartTitle')}
        granularity={granularity}
        timeConfig={timeConfig}
        y1={{
          colors: [chartColors.strokeColors100[5]],
          renderer: Renderer.stackedBar,
          labels: [t('in-websites:websiteDashboard.tabs.businessMonitoring.sessionsChartStartedLabel')],
          metricIds: ['pageLoads'],
          metrics: []
        }}
      />
    </>
  );
}
