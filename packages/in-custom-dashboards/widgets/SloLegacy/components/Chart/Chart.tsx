/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { MetricResult, Result, SliConfigurationWithLastUpdated, SliEntity, TimeConfig } from '@instana/types';
import { just, Observable } from '@instana/observables';
import { themes } from '@instana/design-tokens';
import { Message } from '@instana/components';

import {
  isApplicationSliConfig,
  isAvailabilitySliConfig,
  isWebsiteEventBasedSliConfig,
  isWebsiteTimeBasedSliConfig,
  SliConfig
} from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import { useLinkToUnboundedAnalytics } from 'in-custom-dashboards/widgets/SloLegacy/hooks/analytics/useLinkToUnboundedAnalytics';
import useShouldShowMissingDataIndicator from 'in-custom-dashboards/widgets/SloLegacy/hooks/useShouldShowMissingDataIndicator';
import { useStairwayRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/stairway';
import ChartMarkerLanes from 'in-custom-dashboards/widgets/SloLegacy/components/ChartMarkerLanes/ChartMarkerLanes';
import { useSliFormatter } from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSliFormatter';
import { getTagCatalog as getWebsiteTagCatalog } from 'in-websites/api/tagCatalog';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { sliCHClusterAccessEnabled } from 'in-services/featureFlags';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { MetricDataSeries } from 'in-components/Chart/types';
import { pendingResult } from 'in-services/fixedObjects';
import { CALLS } from 'in-applications/analyze/metrics';
import { error } from 'in-services/util/result';
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
  sliConfig?: SliConfigurationWithLastUpdated;
  nonInteractive?: boolean;
  disableZooming?: boolean;
  trackers?: ChartTrackers;
  customHeight?: number;
  noPadding?: boolean;
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
  trackers,
  customHeight
}: ChartProps) {
  const tagCatalogLoader = useTagCatalogLoader(sliConfig);
  const tagCatalog = useTagCatalog(tagCatalogLoader);
  const isStaticBudget = hourlyBudget === null || hourlyBudget.length === 0;
  const linkToUnboundAnalytics = useLinkToUnboundedAnalytics(sliConfig, tagCatalog);
  const initialEvaluationTimestamp = sliCHClusterAccessEnabled
    ? sliConfig?.lastUpdated
    : sliConfig?.initialEvaluationTimestamp;

  const showMissingDataIndicators =
    useShouldShowMissingDataIndicator({
      initialEvaluationTimestamp,
      progress: result.progress,
      timeConfig,
      nonInteractive
    }) && sliCHClusterAccessEnabled;

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
    firstCollectedMetricTimestamp: initialEvaluationTimestamp ?? undefined
  });

  return (
    <div className={locals.chartContainer}>
      <ResultAwareChart
        result={result}
        config={{
          customHeight,
          automaticallySize: !nonInteractive,
          granularity,
          timeConfig: { ...timeConfig, autoRefresh: false },
          y1: {
            metricIds: ['consumed', 'hourlyBudget'],
            labels: [
              t('in-custom-dashboards:widgets.slo.chart.spent'),
              t('in-custom-dashboards:widgets.slo.chart.budget')
            ],
            icons: {
              types: ['lib_flame', 'lib_actions_stop']
            },
            colors: [themes.default.ids.color.option.blue['500'], themes.default.ids.color.option.red['500']],
            renderer,
            metrics: [...metrics],
            formatter: useSliFormatter(sliConfig?.sliEntity)
          },
          nonInteractive: nonInteractive,
          renderPostChartContent: props =>
            showMissingDataIndicators && (
              <ChartMarkerLanes
                tooltipContent={t('in-custom-dashboards:widgets.slo.chart.initialEvaluation', {
                  configType: t('in-custom-dashboards:widgets.slo.chart.configType')
                })}
                initialEvaluationTimestamp={initialEvaluationTimestamp}
                {...props}
              />
            ),
          ...getCustomAnalyzeContextMenuProperties(linkToUnboundAnalytics, sliConfig, disableZooming, trackers)
        }}
      />
      {showMissingDataIndicators && (
        <Message
          title={t('in-custom-dashboards:widgets.slo.chart.missingDataInfo', {
            configType: t('in-custom-dashboards:widgets.slo.chart.configType')
          })}
          withIcon
          dismissible
          small
        />
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
