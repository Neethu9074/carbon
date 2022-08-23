/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { Observable, just } from '@instana/observables';
import { Message } from '@instana/components';

import {
  isApplicationSliConfig,
  isAvailabilitySliConfig,
  isWebsiteEventBasedSliConfig,
  isWebsiteTimeBasedSliConfig,
  SliConfig
} from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { useLinkToUnboundedAnalytics } from 'in-custom-dashboards/widgets/Slo/hooks/analytics/useLinkToUnboundedAnalytics';
import PostChartContent from 'in-custom-dashboards/widgets/Slo/components/Chart/PostChartContent';
import { useStairwayRenderer } from 'in-custom-dashboards/widgets/Slo/renderer/stairway';
import { useSliFormatter } from 'in-custom-dashboards/widgets/Slo/hooks/useSliFormatter';
import { getTagCatalog as getWebsiteTagCatalog } from 'in-websites/api/tagCatalog';
import { MetricResult, Result, SliEntity, TimeConfig } from 'in-types';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { sliCHClusterAccessEnabled } from 'in-services/featureFlags';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { MetricDataSeries } from 'in-components/Chart/types';
import { error, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { CALLS } from 'in-applications/analyze/metrics';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './Chart.mless';

export interface ChartTrackers {
  trackJumpToUnboundedAnalytics?: (e: SliEntity) => void;
}

export interface ChartProps {
  result: Result<MetricResult[]>;
  timeConfig: TimeConfig;
  granularity: number;
  consumed: MetricDataSeries;
  hourlyBudget: MetricDataSeries;
  budget: number;
  sliConfig?: SliConfig;
  nonInteractive?: boolean;
  disableZooming?: boolean;
  trackers?: ChartTrackers;
}

export default function Chart({
  result,
  timeConfig,
  granularity,
  consumed,
  hourlyBudget,
  budget,
  sliConfig,
  nonInteractive,
  disableZooming,
  trackers
}: ChartProps) {
  const tagCatalogLoader = useTagCatalogLoader(sliConfig);
  const tagCatalog = useTagCatalog(tagCatalogLoader);
  const isStaticBudget = hourlyBudget === null || hourlyBudget.length === 0;
  const linkToUnboundAnalytics = useLinkToUnboundedAnalytics(sliConfig, tagCatalog);

  const showMissingDataIndicators =
    sliCHClusterAccessEnabled &&
    !isLoading(result) &&
    !nonInteractive &&
    sliCreatedWithinTimeWindow(sliConfig, timeConfig);

  let metrics: MetricDataSeries[] = [consumed, hourlyBudget];

  if (isStaticBudget) {
    // TODO replace with a more elegant way, by moving this feature into the renderer
    metrics = [consumed, consumed.map<[number, number]>(timeValue => [timeValue[0], budget])];
  }

  const renderer = useStairwayRenderer({
    metricConfiguration: {
      hourlyBudget: { fillTopBackground: true }
    },
    // Setting undefined here will disable the missing data indicator in the chart
    firstCollectedMetricTimestamp: sliCHClusterAccessEnabled ? sliConfig?.initialEvaluationTimestamp : undefined
  });

  return (
    <div className={locals.chartContainer}>
      <ResultAwareChart
        result={result}
        config={{
          automaticallySize: !nonInteractive,
          granularity,
          timeConfig,
          y1: {
            metricIds: ['consumed', 'hourlyBudget'],
            labels: [
              t('in-custom-dashboards:widgets.slo.chart.spent'),
              t('in-custom-dashboards:widgets.slo.chart.budget')
            ],
            icons: {
              types: ['lib_flame', 'lib_actions_stop']
            },
            colors: [theme.lib.colors.blue800, theme.lib.colors.red800],
            renderer,
            metrics: [...metrics],
            formatter: useSliFormatter(sliConfig?.sliEntity),
            isStaticBudget
          },
          nonInteractive: nonInteractive,
          renderPostChartContent: props =>
            showMissingDataIndicators && <PostChartContent sliConfig={sliConfig} {...props} />,
          ...getCustomAnalyzeContextMenuProperties(linkToUnboundAnalytics, sliConfig, disableZooming, trackers)
        }}
      />
      {showMissingDataIndicators && (
        <Message title={t('in-custom-dashboards:widgets.slo.chart.missingDataInfo')} withIcon dismissible small />
      )}
    </div>
  );
}

function getCustomAnalyzeContextMenuProperties(
  linkToUnboundAnalytics: (tc: TimeConfig) => Observable<string> | undefined,
  sliConfig?: SliConfig,
  disableZooming?: boolean,
  trackers?: ChartTrackers
) {
  if (!sliConfig) {
    return {}; // use defaults
  }

  const onClick = () => trackers?.trackJumpToUnboundedAnalytics?.(sliConfig.sliEntity);

  return {
    primaryContextMenuAction: 'analyze',
    excludedContextMenuActions: disableZooming ? ['zoomIn'] : [],
    additionalContextMenuButtons: [
      {
        name: 'analyze',
        icon: 'lib_analyze',
        label: t('in-custom-dashboards:widgets.slo.chart.viewInAnalyze'),
        allowClickPropagationAndDefault: true,
        onClick,
        getHref$: linkToUnboundAnalytics
      }
    ]
  };
}

function useTagCatalogLoader(config?: SliConfig): Parameters<typeof useTagCatalog>[0] {
  return useMemo(() => {
    if (!config) {
      return () => just(pendingResult);
    }
    if (isApplicationSliConfig(config) || isAvailabilitySliConfig(config)) {
      return getApplicationTagCatalog({ dataSource: CALLS, useCase: 'FILTERING' });
    }
    if (isWebsiteTimeBasedSliConfig(config) || isWebsiteEventBasedSliConfig(config)) {
      const {
        sliEntity: { beaconType }
      } = config;
      return () => getWebsiteTagCatalog({ beaconType, useCase: 'FILTERING' });
    }
    return () => just(error([]));
  }, [config]);
}

function sliCreatedWithinTimeWindow(sliConfig: SliConfig | undefined, timeConfig: TimeConfig): boolean {
  return (
    Boolean(sliConfig) && sliConfig!.initialEvaluationTimestamp >= (timeConfig.to ?? Date.now()) - timeConfig.windowSize
  );
}
