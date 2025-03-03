/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { highlightedTimeframe$, addOrDeleteHighlightedTimeframeToParams } from 'in-stores/highlightedTimeframe';
import SingleMarkerLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleMarkerLaneItem';
import ProfileMarker from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileMarker';
import MarkerLane from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import HoverArea from 'in-components/Chart/markerLanes/MarkerLane/HoverArea';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { formatDateTime } from 'in-services/formatters/date';
import bucketize from 'in-services/util/bucketize';
import { t } from 'in-i18n';

import locals from './ProfilesLane.mless';

export default function ProfilesLane(props) {
  const clusteredProfiles = useClusteredTimestamps(props.chartWidth, props.timeConfig, props.profileTimestamps);
  const highlightedTimeframe = useObservable(highlightedTimeframe$, []);
  const { location, createHref } = useNavigation();
  return (
    <MarkerLane
      {...props}
      isClustered={false}
      events={clusteredProfiles.map((clusteredTimestamps, i) =>
        mapClusterToMarkerLaneEvents(props.timeConfig, clusteredTimestamps, clusteredProfiles[i - 1])
      )}
      label={t('in-profiling:profiles')}
      iconConfig={{
        type: 'lib_datetime_timer',
        typeCluster: 'lib_datetime_timer_multiple',
        color: themes.default.ids.color.option.neutral['700']
      }}
      color={themes.default.ids.color.option.neutral['700']}
      getHref$={({ from, to }) => {
        if (highlightedTimeframe && highlightedTimeframe[0] === from && highlightedTimeframe[1] === to) {
          addOrDeleteHighlightedTimeframeToParams(location);
        } else {
          addOrDeleteHighlightedTimeframeToParams(location, from, to);
        }
        return just(createHref(location));
      }}
      tooltipContent={TooltipContent}
      LaneItem={SingleMarkerLaneItem}
      HoverOverlay={HoverClusterArea}
      renderMarkerItem={ProfileMarker}
    />
  );
}

function useClusteredTimestamps(chartWidth, timeConfig, profileTimestamps) {
  const bucketSizeInMillis = getClusterSizeInMillis(chartWidth, timeConfig.windowSize);
  return useMemo(
    () =>
      bucketize({
        sortedTimestamps: profileTimestamps,
        bucketSizeInMillis
      }),
    [profileTimestamps, bucketSizeInMillis]
  );
}

function mapClusterToMarkerLaneEvents(timeConfig, clusteredTimestamps, prevCluster) {
  const to = clusteredTimestamps[clusteredTimestamps.length - 1];
  return {
    prevCluster,
    timestamp: to,

    from: Math.max(
      timeConfig.to - timeConfig.windowSize,
      prevCluster
        ? prevCluster[prevCluster.length - 1] + 1 // the prev cluster ends at. so +1 to not include this cluster into the prev one
        : 0
    ),
    to,
    count: clusteredTimestamps.length
  };
}

function TooltipContent({ timestamp, from, to, count }) {
  return (
    <div className={locals.tooltipContent}>
      <div>
        {count > 1 ? (
          <>
            from: <time dateTime={new Date(from).toISOString()}>{formatDateTime(from)}</time>
            <br />
            to: <time dateTime={new Date(to).toISOString()}>{formatDateTime(to)}</time>
            <div className={locals.name}>{t('in-profiling:numbersOfProfilesCollected', { count: count })}</div>
          </>
        ) : (
          <>
            <time dateTime={new Date(timestamp).toISOString()}>{formatDateTime(timestamp)}</time>
            <div className={locals.name}>{t('in-profiling:profileCollected')}</div>
          </>
        )}
      </div>
    </div>
  );
}

function HoverClusterArea(props) {
  const { xScale, eventData } = props;
  const xPos = xScale.getRange(eventData.to);
  const fromXPos = xScale.getRange(eventData.from);

  return <HoverArea {...props} xPos={xPos} fromXPos={fromXPos} toXPos={xPos} />;
}

function getClusterSizeInMillis(width, windowSize) {
  const iconSizeInPx = 16;
  return windowSize / (width / iconSizeInPx);
}
