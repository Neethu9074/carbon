import React, { useMemo } from 'react';
import theme from 'in-themes';

import {
  highlightedTimeframe$,
  addOrDeleteHighlightedTimeframeToParams
} from 'in-stores/timeline/highlightedTimeframe';
import SingleMarkerLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleMarkerLaneItem';
import MarkerLane from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import HoverArea from 'in-components/Chart/markerLanes/MarkerLane/HoverArea';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { formatDateTime } from 'in-services/formatters/date';
import bucketize from 'in-services/util/bucketize';
import useObservable from 'in-hooks/useObservable';
import ProfileMarker from './ProfileMarker';

import locals from './ProfilesLane.mless';

export default function ProfilesLane(props) {
  const clusteredProfiles = useClusteredTimestamps(props.chartWidth, props.timeConfig, props.profileTimestamps);
  const highlightedTimeframe = useObservable(highlightedTimeframe$, []);

  return (
    <MarkerLane
      {...props}
      isClustered={false}
      events={clusteredProfiles.map((clusteredTimestamps, i) =>
        mapClusterToMarkerLaneEvents(props.timeConfig, clusteredTimestamps, clusteredProfiles[i - 1])
      )}
      label="Profiles"
      iconConfig={{
        type: 'lib_datetime_timer',
        typeCluster: 'lib_datetime_timer_multiple',
        color: theme.lib.colors.N700Medium
      }}
      color={theme.lib.colors.N700Medium}
      getHref$={({ from, to }) =>
        getModifiedUrlStream(params => {
          if (highlightedTimeframe && highlightedTimeframe[0] === from && highlightedTimeframe[1] === to) {
            return addOrDeleteHighlightedTimeframeToParams(params);
          }
          addOrDeleteHighlightedTimeframeToParams(params, from, to);
        })
      }
      tooltipContent={TooltipContent}
      LaneItem={SingleMarkerLaneItem}
      renderHoverOverlay={HoverClusterArea}
      renderMarkerItem={ProfileMarker}
    />
  );
}

function useClusteredTimestamps(chartWidth, timeConfig, profileTimestamps) {
  const bucketSizeInMillis = getClusterSizeInMillis(chartWidth, timeConfig.windowSize);
  return useMemo(() => {
    const bucketResult = bucketize({
      sortedTimestamps: profileTimestamps,
      bucketSizeInMillis
    });
    return bucketResult;
  }, [chartWidth, timeConfig.windowSize, timeConfig.to, profileTimestamps]);
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
            <div className={locals.name}>{`${count} profiles collected`}</div>
          </>
        ) : (
          <>
            <time dateTime={new Date(timestamp).toISOString()}>{formatDateTime(timestamp)}</time>
            <div className={locals.name}>profile collected</div>
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
