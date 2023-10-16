/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ForwardedRef, forwardRef } from 'react';

import { ReleaseCluster } from '@instana/types/typeDefinitions';

import MarkerLane, { LaneItemProps, MarkerLaneEvent } from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import SingleMarkerLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleMarkerLaneItem';
import { PresentedLaneProps } from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import HoverLine from 'in-components/Chart/markerLanes/MarkerLane/HoverLine';
import HoverArea from 'in-components/Chart/markerLanes/MarkerLane/HoverArea';
import LaneIcon from 'in-components/Chart/markerLanes/MarkerLane/LaneIcon';
import { ChartContentPostition } from 'in-components/Chart/types';
import { formatDateTime } from 'in-services/formatters/date';
import { useTheme } from 'in-themes';
import { t } from 'in-i18n';

import locals from './ReleasesLanePresenter.mless';

const maxNumReleasesToShow = 3;

interface ReleasesLanePresenterProps extends PresentedLaneProps {
  releases: ReleaseCluster[];
  labelVisible: boolean;
  chartContentPosition: ChartContentPostition;
}
export default function ReleasesLanePresenter(props: ReleasesLanePresenterProps) {
  const theme = useTheme();
  return (
    <MarkerLane<ReleaseCluster>
      {...props}
      events={props.releases}
      label={t('in-components:chart.chartReleasesLanePresenterReleasesLabel')}
      color={theme.ids.color.option.neutral['700']}
      TooltipContent={({ clusteredReleases = [] }) => (
        <div className={locals.tooltipContent}>
          {clusteredReleases.slice(0, maxNumReleasesToShow).map(({ name, start }) => (
            <div key={start}>
              <time dateTime={new Date(start).toISOString()}>{formatDateTime(start)}</time>
              <div className={locals.name}>{`${name}`}</div>
            </div>
          ))}
          {clusteredReleases.length > maxNumReleasesToShow && (
            <div>
              {t('in-components:chart.chartReleasesLanePresenterTooltip', {
                len: clusteredReleases.length - maxNumReleasesToShow
              })}
            </div>
          )}
        </div>
      )}
      LaneItem={ReleasesMarkerLaneItem}
      HoverOverlay={props.isClustered ? HoverArea : HoverLine}
    />
  );
}

const ReleasesMarkerLaneItem = forwardRef(function ReleasesMarkerLaneItem(
  props: LaneItemProps<MarkerLaneEvent>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const theme = useTheme();
  return (
    <SingleMarkerLaneItem<MarkerLaneEvent>
      ref={ref}
      renderMarkerItem={markerItemProps => (
        <LaneIcon
          {...markerItemProps}
          iconConfig={{
            type: 'lib_release_rocket',
            typeCluster: 'lib_release_rocket',
            color: theme.ids.color.option.neutral['700']
          }}
        />
      )}
      {...props}
    />
  );
});
