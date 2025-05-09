/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import React, { ForwardedRef, forwardRef } from 'react';

import { themes } from '@instana/design-tokens';

import MarkerLane, { LaneItemProps, MarkerLaneEvent } from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import SingleMarkerLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleMarkerLaneItem';
import { PresentedLaneProps } from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import HoverLine from 'in-components/Chart/markerLanes/MarkerLane/HoverLine';
import HoverArea from 'in-components/Chart/markerLanes/MarkerLane/HoverArea';
import LaneIcon from 'in-components/Chart/markerLanes/MarkerLane/LaneIcon';
import { ChartContentPostition } from 'in-components/Chart/types';
import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

import locals from './CDEventsLanePresenter.mless';

const maxNumEventsToShow = 3;

interface CDEventsLanePresenterProps extends PresentedLaneProps {
  cdEvents: CDEventCluster[];
  labelVisible: boolean;
  chartContentPosition: ChartContentPostition;
}

export interface CDEventCluster {
  readonly clusteredCDEvents?: CDEventWithId[];
  readonly timestamp: number;
}

export interface CDEventWithId {
  readonly lastUpdated: number;
  readonly name: string;
  readonly start: number;
}

export default function CDEventsLanePresenter(props: CDEventsLanePresenterProps) {
  return (
    <MarkerLane<CDEventCluster>
      {...props}
      events={props.cdEvents}
      label={t('in-components:chart.chartCDEventsLanePresenterLabel')}
      color={themes.default.ids.color.option.neutral['700']}
      TooltipContent={({ clusteredCDEvents = [] }) => (
        <div className={locals.tooltipContent}>
          {clusteredCDEvents.slice(0, maxNumEventsToShow).map(({ name, start }) => (
            <div key={start}>
              <time dateTime={new Date(start).toISOString()}>{formatDateTime(start)}</time>
              <div className={locals.name}>
                {t('in-components:chart.chartCDEventsLanePresenterApplicationSyncTooltip', { name })}
              </div>
            </div>
          ))}
          {clusteredCDEvents.length > maxNumEventsToShow && (
            <div>
              {t('in-components:chart.chartCDEventsLanePresenterTooltip', {
                len: clusteredCDEvents.length - maxNumEventsToShow
              })}
            </div>
          )}
        </div>
      )}
      LaneItem={CDEventMarkerLaneItem}
      HoverOverlay={props.isClustered ? HoverArea : HoverLine}
    />
  );
}

const CDEventMarkerLaneItem = forwardRef(function CDEventMarkerLaneItem(
  props: LaneItemProps<MarkerLaneEvent>,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <SingleMarkerLaneItem<MarkerLaneEvent>
      ref={ref}
      renderMarkerItem={markerItemProps => (
        <LaneIcon
          {...markerItemProps}
          iconConfig={{
            type: 'lib_continuous_deployment',
            typeCluster: 'lib_continuous_deployment',
            color: themes.default.ids.color.option.neutral['700']
          }}
        />
      )}
      {...props}
    />
  );
});
