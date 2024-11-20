/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DateAsNumber, ServiceLevelIndicatorUnion, SyntheticSloEntity } from '@instana/types';
import { themes } from '@instana/design-tokens';

import { useBarWithMissingDataIndicatorRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/barWithMissingDataIndicator';
import useSyntheticsEventBasedAvailabilityMetrics from 'in-service-levels/hooks/useSyntheticsAvailabilityEventBasedMetrics';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
import FilterInfo from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/FilterInfo';
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import { calculateEventGraphGranularity } from 'in-service-levels/utils/time';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const goodEventsMetricId = 'goodEvents';
const badEventsMetricId = 'badEvents';
interface SyntheticsEventBasedAvailabilityIndicatorChartProps {
  automaticallySize?: boolean;
  customHeight?: number;
  customChartSkeletonHeight?: number;
  entity: SyntheticSloEntity;
  indicator: ServiceLevelIndicatorUnion;
  missingDataIndicator?: DateAsNumber;
  title?: string;
}
export default function SyntheticsEventBasedAvailabilityIndicatorChart({
  automaticallySize,
  customHeight,
  customChartSkeletonHeight,
  entity,
  indicator,
  missingDataIndicator,
  title
}: SyntheticsEventBasedAvailabilityIndicatorChartProps) {
  const sloZoomInAction = useSloZoomInAction();
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const granularity = calculateEventGraphGranularity(timeConfig);
  const result = useSyntheticsEventBasedAvailabilityMetrics(entity, timeConfig, granularity);
  const renderer = useBarWithMissingDataIndicatorRenderer({
    firstCollectedMetricTimestamp: missingDataIndicator
  });

  const goodEventsMetricResult = result.data?.good ?? [];
  const badEventsMetricResult = result.data?.bad ?? [];

  return (
    <ResultAwareChart
      config={{
        automaticallySize,
        customHeight,
        customChartSkeletonHeight,
        title,
        rightHeaderContent: <FilterInfo entity={entity} indicator={indicator} />,
        primaryContextMenuAction: sloZoomInAction.name,
        additionalContextMenuButtons: [sloZoomInAction],
        excludedContextMenuActions: [zoomInAction.name],
        granularity,
        y1: {
          metricIds: [badEventsMetricId, goodEventsMetricId],
          metrics: [badEventsMetricResult, goodEventsMetricResult],
          labels: [t('in-service-levels:general.metrics.badEvents'), t('in-service-levels:general.metrics.goodEvents')],
          colors: [themes.default.ids.color.option.red['500'], themes.default.ids.color.option.green['500']],
          formatter: number.compact,
          renderer
        },
        timeConfig,
        renderPostChartContent: props => <SloDashboardMarkerLanes entity={entity} {...props} />
      }}
      result={result}
    />
  );
}
