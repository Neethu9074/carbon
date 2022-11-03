/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { formatDateTime } from '@instana/format-date';

import SliCreationMarkerLaneItem from 'in-custom-dashboards/widgets/Slo/components/ChartMarkerLanes/SliCreationMarkerLaneItem';
import MarkersLane, { MarkerLaneEvent } from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import { PresentedLaneProps } from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import HoverLine from 'in-components/Chart/markerLanes/MarkerLane/HoverLine';
import { ChartContentPostition } from 'in-components/Chart/types';
import theme from 'in-themes';

interface SliCreationMarkerLaneProps extends Partial<PresentedLaneProps> {
  chartContentPosition: ChartContentPostition;
  initialEvaluationTimestamp: number;
  tooltipContent: React.ReactNode;
}

export default function SliCreationMarkerLane({
  initialEvaluationTimestamp,
  chartContentPosition,
  tooltipContent,
  ...restProps
}: SliCreationMarkerLaneProps) {
  return (
    <MarkersLane
      {...restProps}
      chartContentPosition={chartContentPosition}
      isClustered={false} // Force clustering off, because we ever only have a single event in this marker lane
      events={[{ timestamp: initialEvaluationTimestamp }]}
      label={''}
      LaneItem={SliCreationMarkerLaneItem}
      HoverOverlay={HoverLine}
      TooltipContent={({ timestamp }) => (
        <SliCreationMarkerTooltipContent timestamp={timestamp}>{tooltipContent}</SliCreationMarkerTooltipContent>
      )}
      color={theme.lib.colors.N700Medium}
    />
  );
}

interface SliCreationMarkerTooltipContentProps extends MarkerLaneEvent {
  children: React.ReactNode;
}

function SliCreationMarkerTooltipContent({ timestamp, children }: SliCreationMarkerTooltipContentProps) {
  return (
    <div>
      <time dateTime={new Date(timestamp).toISOString()}>{formatDateTime(timestamp)}</time>
      <div>{children}</div>
    </div>
  );
}
