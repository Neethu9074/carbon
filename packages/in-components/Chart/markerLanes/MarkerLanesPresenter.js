import React, { useState, Children, cloneElement, useRef, useEffect } from 'react';
import { create } from 'reactive-observables';
import PropTypes from 'prop-types';

import { hasMarkersToRenderSignal$ } from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { getBlockSizeMillis } from 'in-services/util/dynamicAggregation';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { sizes } from 'in-components/SvgIcon/SvgIcon';

import locals from './MarkerLanesPresenter.mless';

const markerLaneLabelVisibleSignalSrc$ = create();

export function setMarkerLaneLabelVisibility(labelVisible) {
  markerLaneLabelVisibleSignalSrc$.emit(labelVisible);
}

export const markerLaneLabelVisibleSignal$ = markerLaneLabelVisibleSignalSrc$.emit(false);

const minBlockWidth = sizes.xs;
export default function MarkerLanesPresenter({
  children,
  granularity,
  chartWidth,
  chartBucketWidth,
  ...remainingProps
}) {
  if (!children || !granularity) return null;

  const [labelAlignment, setLabelAligment] = useState('left');
  const [hasMarkersToRender, setHasMarkersToRender] = useState(false);

  let laneWithMarkersCount = 0;

  useEffect(() => {
    let noMarkersInAnyLaneSignalSub = hasMarkersToRenderSignal$.subscribe(hasMarkers => {
      if (hasMarkers) laneWithMarkersCount++;
      setHasMarkersToRender(laneWithMarkersCount > 0);
      setMarkerLaneLabelVisibility(laneWithMarkersCount === 0);
    });
    return () => {
      noMarkersInAnyLaneSignalSub.dispose();
      noMarkersInAnyLaneSignalSub = null;
    };
  }, []);

  return (
    <div
      className={locals.markerLanesContainer}
      onMouseLeave={e => {
        stopPropagationAndPreventDefault(e);
        if (hasMarkersToRender) markerLaneLabelVisibleSignal$.emit(false);
      }}
    >
      <MarkerLanesWrapper
        labelAlignment={labelAlignment}
        chartWidth={chartWidth}
        granularity={granularity}
        chartBucketWidth={chartBucketWidth}
        remainingProps={remainingProps}
      />
      <div
        className={locals[labelAlignment]}
        onMouseEnter={e => {
          stopPropagationAndPreventDefault(e);
          if (hasMarkersToRender) setLabelAligment(labelAlignment === 'left' ? 'right' : 'left');
        }}
      />
    </div>
  );

  function MarkerLanesWrapper({ labelAlignment, chartWidth, granularity, chartBucketWidth, remainingProps }) {
    const isClustered = chartBucketWidth < minBlockWidth - 2;

    const markerLanesWrapperRef = useRef(null);
    return (
      <div
        ref={markerLanesWrapperRef}
        className={locals.markerLanesWrapper}
        onMouseEnter={e => {
          stopPropagationAndPreventDefault(e);
          markerLaneLabelVisibleSignal$.emit(true);
        }}
      >
        {Children.toArray(children)
          .filter(Boolean)
          .map(child => {
            return cloneElement(child, {
              ...remainingProps,
              labelAlignment,
              clusterSizeMillis: isClustered
                ? getClusterSizeMillis({
                    width: chartWidth || markerLanesWrapperRef.current?.getBoundingClientRect()?.width,
                    windowSize: remainingProps.timeConfig.windowSize,
                    granularity
                  })
                : granularity,
              isClustered,
              chartBucketWidth,
              chartWidth,
              granularity
            });
          })}
      </div>
    );
  }
}

function getClusterSizeMillis({ windowSize, width, granularity }) {
  return getBlockSizeMillis({
    windowSize,
    minPixelsPerBlock: minBlockWidth,
    width,
    rollup: granularity
  });
}

MarkerLanesPresenter.propTypes = {
  timeConfig: propTypeTimeConfig,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  granularity: PropTypes.number,
  chartWidth: PropTypes.number,
  chartBucketWidth: PropTypes.number
};
