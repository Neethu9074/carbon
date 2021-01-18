import React, { useState, Children, cloneElement, useRef } from 'react';
import PropTypes from 'prop-types';

import { getBlockSizeMillis } from 'in-services/util/dynamicAggregation';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { sizes } from 'in-components/SvgIcon/SvgIcon';

import locals from './MarkerLanesPresenter.mless';

const minBlockWidth = sizes.xs;

export default function MarkerLanesPresenterPropsChecker(props) {
  if (!props.children || !props.granularity) {
    return null;
  }

  return <MarkerLanesPresenter {...props} />;
}
function MarkerLanesPresenter({ children, granularity, chartWidth, chartBucketWidth, ...remainingProps }) {
  const [labelAlignment, setLabelAligment] = useState('left');
  const [hasMarkersToRender, setHasMarkersToRender] = useState(false);
  const [laneLabelsVisible, setLaneLabelsVisibility] = useState(false);

  return (
    <div
      className={locals.markerLanesContainer}
      onMouseLeave={() => {
        if (hasMarkersToRender) setLaneLabelsVisibility(false);
      }}
    >
      <MarkerLanesWrapper
        lanes={children}
        setLaneLabelsVisibility={isVisible => setLaneLabelsVisibility(isVisible)}
        labelAlignment={labelAlignment}
        chartWidth={chartWidth}
        granularity={granularity}
        chartBucketWidth={chartBucketWidth}
        laneLabelsVisible={(hasMarkersToRender && laneLabelsVisible) || (!hasMarkersToRender && !laneLabelsVisible)}
        onLaneHasMarkersToRender={() => setHasMarkersToRender(true)}
        hasMarkersToRender={hasMarkersToRender}
        {...remainingProps}
      />
      <div
        className={locals[labelAlignment]}
        onMouseEnter={() => {
          if (hasMarkersToRender) setLabelAligment(labelAlignment === 'left' ? 'right' : 'left');
        }}
      />
    </div>
  );
}

function MarkerLanesWrapper({
  lanes,
  setLaneLabelsVisibility,
  labelAlignment,
  chartWidth,
  granularity,
  chartBucketWidth,
  laneLabelsVisible,
  hasMarkersToRender,
  ...remainingProps
}) {
  const isClustered = chartBucketWidth < minBlockWidth - 2;

  const markerLanesWrapperRef = useRef(null);
  return (
    <div
      ref={markerLanesWrapperRef}
      className={locals.markerLanesWrapper}
      onMouseEnter={() => {
        if (hasMarkersToRender) setLaneLabelsVisibility(true);
      }}
    >
      {Children.toArray(lanes)
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
            granularity,
            laneLabelsVisible
          });
        })}
    </div>
  );
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
