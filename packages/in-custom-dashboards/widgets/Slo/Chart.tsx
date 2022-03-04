/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { Observable, just } from '@instana/observables';

import {
  isApplicationSliConfig,
  isAvailabilitySliConfig,
  isWebsiteEventBasedSliConfig,
  isWebsiteTimeBasedSliConfig,
  SliConfig
} from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { useLinkToUnboundedAnalytics } from 'in-custom-dashboards/widgets/Slo/hooks/useLinkToUnboundedAnalytics';
import stairway, { hourlyBudgetMetricId } from 'in-custom-dashboards/widgets/Slo/renderer/stairway';
import { useSliFormatter } from 'in-custom-dashboards/widgets/Slo/hooks/useSliFormatter';
import { getTagCatalog as getWebsiteTagCatalog } from 'in-websites/api/tagCatalog';
import { MetricResult, Result, SliEntity, TimeConfig } from 'in-types';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { MetricDataSeries } from 'in-components/Chart/types';
import { pendingResult } from 'in-services/fixedObjects';
import { CALLS } from 'in-applications/analyze/metrics';
import { error } from 'in-services/util/result';
import theme from 'in-themes';
import { t } from 'in-i18n';

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
  isPreview?: boolean;
  disableZooming?: boolean;
  trackers?: ChartTrackers;
  automaticallySize?: boolean;
}

export default function Chart({
  result,
  timeConfig,
  granularity,
  consumed,
  hourlyBudget,
  budget,
  sliConfig,
  isPreview,
  disableZooming,
  trackers,
  automaticallySize
}: ChartProps) {
  const tagCatalogLoader = useTagCatalogLoader(sliConfig);
  const tagCatalog = useTagCatalog(tagCatalogLoader);
  const isStaticBudget = hourlyBudget === null || hourlyBudget.length === 0;
  const linkToUnboundAnalytics = useLinkToUnboundedAnalytics(sliConfig, tagCatalog);

  let metrics: MetricDataSeries[] = [consumed, hourlyBudget];

  if (isStaticBudget) {
    // TODO replace with a more elegant way, by moving this feature into the renderer
    metrics = [consumed, consumed.map<[number, number]>(timeValue => [timeValue[0], budget])];
  }

  return (
    <ResultAwareChart
      result={result}
      config={{
        automaticallySize,
        granularity,
        timeConfig,
        y1: {
          metricIds: ['consumed', hourlyBudgetMetricId],
          labels: [
            t('in-custom-dashboards:widgets.slo.chart.spent'),
            t('in-custom-dashboards:widgets.slo.chart.budget')
          ],
          icons: {
            types: ['lib_flame', 'lib_actions_stop']
          },
          colors: [theme.lib.colors.blue800, theme.lib.colors.red800],
          renderer: stairway,
          metrics: [...metrics],
          formatter: useSliFormatter(sliConfig?.sliEntity),
          isStaticBudget
        },
        nonInteractive: isPreview,
        ...getCustomAnalyzeContextMenuProperties(linkToUnboundAnalytics, sliConfig, disableZooming, trackers)
      }}
    />
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
      return getApplicationTagCatalog({ dataSource: CALLS, useCase: 'SLI_MANAGEMENT' });
    }
    if (isWebsiteTimeBasedSliConfig(config) || isWebsiteEventBasedSliConfig(config)) {
      const {
        sliEntity: { beaconType }
      } = config;
      return () => getWebsiteTagCatalog({ beaconType, useCase: 'SMART_ALERTS' });
    }
    return () => just(error([]));
  }, [config]);
}
