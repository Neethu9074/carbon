import React, { useState, Children, cloneElement, useRef } from 'react';
import { create } from 'reactive-observables';
import PropTypes from 'prop-types';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { getBlockSizeMillis } from 'in-services/util/dynamicAggregation';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { sizes } from 'in-components/SvgIcon/SvgIcon';

import locals from './MarkerLanesPresenter.mless';

export const markerLaneLabelVisibleSignal$ = create().emit(false);

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

  return (
    <div
      className={locals.markerLanesContainer}
      onMouseLeave={e => {
        stopPropagationAndPreventDefault(e);
        markerLaneLabelVisibleSignal$.emit(false);
        // setLabelVisible(false);
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
          setLabelAligment(labelAlignment === 'left' ? 'right' : 'left');
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
          // setLabelVisible(true);
        }}
      >
        {Children.map(children, child => {
          return cloneElement(child, {
            ...remainingProps,
            labelAlignment,
            clusterSizeMillis: isClustered
              ? getClusterSizeMillis({
                  width: chartWidth ?? markerLanesWrapperRef.current?.getBoundingClientRect()?.width,
                  windowSize: remainingProps.timeConfig.windowSize,
                  granularity
                })
              : granularity,
            isClustered,
            chartBucketWidth,
            chartWidth
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
