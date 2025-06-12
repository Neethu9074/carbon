/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ForwardedRef, forwardRef, useMemo } from 'react';

import { generateStableHash } from '@instana/utils';
import { CorrectionWindow } from '@instana/types';
import { themes } from '@instana/design-tokens';

import CorrectionWindowsLaneTooltipContent from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes/CorrectionWindowsLaneTooltipContent';
import MarkersLane, { LaneItemProps, MarkerLaneEvent } from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import SingleMarkerLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleMarkerLaneItem';
import { PresentedLaneProps } from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import HoverLine from 'in-components/Chart/markerLanes/MarkerLane/HoverLine';
import LaneIcon from 'in-components/Chart/markerLanes/MarkerLane/LaneIcon';
import { ChartContentPostition } from 'in-components/Chart/types';
import { t } from 'in-i18n';

export type CorrectionWindowWithName = CorrectionWindow & { name?: string };

export interface CorrectionWindowMarkerLaneEvent extends MarkerLaneEvent {
  windows: CorrectionWindowWithName[];
}

function useCorrectionWindowMarkerLaneEvents(clusterSizeMillis: number): CorrectionWindowMarkerLaneEvent[] {
  const { correctionData } = useSloTimeWindowContext();
  return useMemo(
    () => {
      const correctionWindowsWithNames =
        correctionData?.correction?.correctionWindows?.map(window => {
          const [id] = window.correctionConfigs ?? [];
          const config = correctionData?.configurations?.find(config => config.id === id)!;
          return {
            name: config.name,
            ...window
          };
        }) ?? [];
      const groupedCorrectionWindows = correctionWindowsWithNames.reduce<Record<number, CorrectionWindowWithName[]>>(
        (acc, item) => {
          const groupKey = Math.floor(item.from! / clusterSizeMillis) * clusterSizeMillis;
          if (!acc[groupKey]) {
            acc[groupKey] = [];
          }
          acc[groupKey].push(item);
          return acc;
        },
        {}
      );

      return Object.keys(groupedCorrectionWindows)
        .map(Number)
        .map(group => ({
          count: groupedCorrectionWindows[group].length,
          windows: groupedCorrectionWindows[group],
          timestamp: group
        }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [generateStableHash(correctionData), clusterSizeMillis]
  );
}

interface CorrectionWindowsLaneProps {
  chartContentPosition: ChartContentPostition;
}

export default function CorrectionWindowsLane({ chartContentPosition, ...remainingProps }: CorrectionWindowsLaneProps) {
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const { clusterSizeMillis } = remainingProps as PresentedLaneProps;
  const events = useCorrectionWindowMarkerLaneEvents(clusterSizeMillis);

  return (
    <MarkersLane<CorrectionWindowMarkerLaneEvent>
      {...(remainingProps as PresentedLaneProps)}
      label={t('in-service-levels:sloChart.correctionWindowsLane.correctionWindows')}
      events={events}
      timeConfig={timeConfig}
      chartContentPosition={chartContentPosition}
      LaneItem={CorrectionWindowsLaneItem}
      isClustered
      HoverOverlay={HoverLine}
      TooltipContent={CorrectionWindowsLaneTooltipContent}
    />
  );
}

const CorrectionWindowsLaneItem = forwardRef(function CorrectionWindowsLaneItem(
  props: LaneItemProps<CorrectionWindowMarkerLaneEvent>,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <SingleMarkerLaneItem<CorrectionWindowMarkerLaneEvent>
      ref={ref}
      renderMarkerItem={markerItemProps => (
        <LaneIcon
          {...markerItemProps}
          iconConfig={{
            type: 'lib_correction_window',
            typeCluster: 'lib_correction_window_multiple',
            color: themes.default.ids.color.option.blue['500']
          }}
        />
      )}
      {...props}
    />
  );
});
