/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { formatDateTime } from '@instana/format-date';

import SliCreationMarkerLaneItem from 'in-custom-dashboards/widgets/Slo/components/Chart/SliCreationMarkerLaneItem';
import MarkersLane, { MarkerLaneEvent } from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import { PresentedLaneProps } from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import HoverLine from 'in-components/Chart/markerLanes/MarkerLane/HoverLine';
import { SliConfig } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { ChartContentPostition } from 'in-components/Chart/types';
import theme from 'in-themes';
import { t } from 'in-i18n';

export interface SliCreationMarkerLaneEvent extends MarkerLaneEvent {
  sliConfig: SliConfig;
}

interface SliCreationMarkerLaneProps extends Partial<PresentedLaneProps> {
  sliConfig?: SliConfig;
  chartContentPosition: ChartContentPostition;
}

export default function SliCreationMarkerLane({ sliConfig, ...restProps }: SliCreationMarkerLaneProps) {
  const events = sliConfig ? [mapSliConfigToMarkersLaneEvent(sliConfig)] : [];
  return (
    <MarkersLane
      {...restProps}
      isClustered={false} // Force clustering off, because we ever only have a single event in this marker lane
      events={events}
      label={''}
      LaneItem={SliCreationMarkerLaneItem}
      HoverOverlay={HoverLine}
      TooltipContent={SliCreationMarkerTooltipContent}
      color={theme.lib.colors.N700Medium}
    />
  );
}

function SliCreationMarkerTooltipContent({ timestamp }: SliCreationMarkerLaneEvent) {
  return (
    <div>
      <time dateTime={new Date(timestamp).toISOString()}>{formatDateTime(timestamp)}</time>
      <div>{t('in-custom-dashboards:widgets.slo.chart.initialEvaluation')}</div>
    </div>
  );
}

function mapSliConfigToMarkersLaneEvent(config: SliConfig): SliCreationMarkerLaneEvent {
  return {
    timestamp: config.initialEvaluationTimestamp,
    sliConfig: config
  };
}
