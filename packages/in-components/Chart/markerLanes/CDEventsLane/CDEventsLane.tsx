/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ForwardedRef, forwardRef } from 'react';
import classNames from 'classnames';

import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import MarkerLane, { LaneItemProps, MarkerLaneEvent } from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import SingleMarkerLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleMarkerLaneItem';
import { PresentedLaneProps } from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import HoverLine from 'in-components/Chart/markerLanes/MarkerLane/HoverLine';
import HoverArea from 'in-components/Chart/markerLanes/MarkerLane/HoverArea';
import LaneIcon from 'in-components/Chart/markerLanes/MarkerLane/LaneIcon';
import { pendingResult, emptyArray } from 'in-services/fixedObjects';
import { ChartContentPostition } from 'in-components/Chart/types';
import getCDEvents from 'in-events/subscriptions/getCDEvents';
import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

import locals from './CDEventsLane.mless';

const maxNumEventsToShow = 3;

interface CDEventsLaneProps extends PresentedLaneProps {
  clusterSizeMillis: number;
  timeConfig: TimeConfig;
  snapshotId: string;
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

export default function CDEventsLane(props: CDEventsLaneProps) {
  const { timeConfig, clusterSizeMillis, snapshotId } = props;
  const cdEvents = useObservable(getCDEventsObservable, [timeConfig, clusterSizeMillis, snapshotId]) ?? emptyArray;

  const TooltipContent = ({ clusteredCDEvents = [] }: { clusteredCDEvents?: CDEventWithId[] }) => {
    const eventsToShow = clusteredCDEvents.slice(0, maxNumEventsToShow);
    const extraCount = clusteredCDEvents.length - eventsToShow.length;

    return (
      <div className={locals.tooltipContent}>
        {eventsToShow.map(({ name, start }, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === eventsToShow.length - 1;

          return (
            <div
              key={start}
              className={classNames({
                [locals.tooltipItem]: true,
                [locals.withBottomBorder]: !isLast,
                [locals.withTopPadding]: !isFirst
              })}
            >
              <time dateTime={new Date(start).toISOString()}>{formatDateTime(start)}</time>
              <div className={locals.name}>
                {t('in-components:chart.chartCDEventsLaneApplicationSyncTooltip', { name })}
              </div>
            </div>
          );
        })}
        {extraCount > 0 && (
          <div className={locals.tooltipItem}>
            {t('in-components:chart.chartCDEventsLaneTooltip', { len: extraCount })}
          </div>
        )}
      </div>
    );
  };

  return (
    <MarkerLane<CDEventCluster>
      {...props}
      events={cdEvents}
      label={t('in-components:chart.chartCDEventsLaneLabel')}
      color={themes.default.ids.color.option.neutral['700']}
      TooltipContent={TooltipContent}
      LaneItem={CDEventMarkerLaneItem}
      HoverOverlay={props.isClustered ? HoverArea : HoverLine}
    />
  );
}

/**
 *
 * we need this function because in non-live mode we need to use the chart-time-config,
 * which needs to be put in a valid state for the request
 */
function cleanUpChartTimeConfig(timeConfig: TimeConfig): TimeConfig {
  if (timeConfig.to !== timeConfig.focusedMoment) {
    return { ...timeConfig, focusedMoment: timeConfig.to };
  }
  return timeConfig;
}

function getCDEventsObservable([timeConfig, clusterSizeMillis, snapshotId]: [TimeConfig, number, string]) {
  return getCDEvents({
    timeConfig: cleanUpChartTimeConfig(timeConfig),
    granularity: clusterSizeMillis,
    snapshotId
  })
    .startWith(pendingResult)
    .map(({ data }) => data);
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
