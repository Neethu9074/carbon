import React, { useState, Children, cloneElement, useRef } from 'react';
import PropTypes from 'prop-types';

import { getBlockSizeMillis } from 'in-services/util/dynamicAggregation';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { sizes } from 'in-components/SvgIcon/SvgIcon';

import locals from './MarkerLanesPresenter.mless';

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
  const [labelVisible, setLabelVisible] = useState(false);

  return (
    <div className={locals.markerLanesContainer} onMouseLeave={() => setLabelVisible(false)}>
      <MarkerLanesWrapper
        labelVisible={labelVisible}
        labelAlignment={labelAlignment}
        chartWidth={chartWidth}
        granularity={granularity}
        chartBucketWidth={chartBucketWidth}
        remainingProps={remainingProps}
      />
      <div
        className={locals[labelAlignment]}
        onMouseEnter={() => setLabelAligment(labelAlignment === 'left' ? 'right' : 'left')}
      />
    </div>
  );

  function MarkerLanesWrapper({
    labelVisible,
    labelAlignment,
    chartWidth,
    granularity,
    chartBucketWidth,
    remainingProps
  }) {
    const isClustered = chartBucketWidth < minBlockWidth - 2;

    const markerLanesWrapperRef = useRef(null);
    return (
      <div ref={markerLanesWrapperRef} className={locals.markerLanesWrapper} onMouseEnter={() => setLabelVisible(true)}>
        {Children.map(children, child => {
          return cloneElement(child, {
            ...remainingProps,
            labelVisible,
            labelAlignment,
            clusterSizeMillis: isClustered
              ? getClusterSizeMillis({
                  width: chartWidth ?? markerLanesWrapperRef.current?.getBoundingClientRect()?.width,
                  windowSize: remainingProps.timeConfig.windowSize,
                  granularity
                })
              : granularity,
            isClustered,
            chartBucketWidth
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
