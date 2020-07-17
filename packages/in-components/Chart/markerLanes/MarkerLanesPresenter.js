import React, { useState, Children, cloneElement, useRef } from 'react';
import PropTypes from 'prop-types';

import { getBlockSizeMillis } from 'in-services/util/dynamicAggregation';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { sizes } from 'in-components/SvgIcon/SvgIcon';

import locals from './MarkerLanesPresenter.mless';

const minPixelsPerBlock = sizes.xs;
export default function MarkerLanesPresenter({
  children,
  granularity,
  hoverState,
  chartWidth,
  chartBucketWidth,
  ...remainingProps
}) {
  if (!children || !granularity || !hoverState) return null;

  const [labelAlignment, setLabelAligment] = useState('left');
  const [labelVisible, setLabelVisible] = useState(false);

  return (
    <div className={locals.markerLanesContainer} onMouseLeave={() => setLabelVisible(false)}>
      <MarkerLanesWrapper
        labelVisible={labelVisible}
        labelAlignment={labelAlignment}
        chartWidth={chartWidth}
        isClustered={chartBucketWidth < minPixelsPerBlock - 2}
        granularity={granularity}
        remainingProps={remainingProps}
      />
      <div
        className={locals[labelAlignment]}
        onMouseEnter={() => setLabelAligment(labelAlignment === 'left' ? 'right' : 'left')}
      />
      <HoverLine {...hoverState} />
    </div>
  );

  function MarkerLanesWrapper({ labelVisible, labelAlignment, chartWidth, isClustered, granularity, remainingProps }) {
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
            isClustered
          });
        })}
      </div>
    );
  }
}

function HoverLine({ overlayVisible, lineVisible, xPos, chartContentPosition, color }) {
  return (
    <>
      {(overlayVisible || lineVisible) && (
        <div
          className={locals.hoverLine}
          style={{
            transform: `translateX(${xPos}px)`,
            color,
            ...getTopAndBottomOffset()
          }}
        />
      )}
    </>
  );

  function getTopAndBottomOffset() {
    if (overlayVisible) {
      if (chartContentPosition === 'pre') return { bottom: '5px', top: '8px' };
      if (chartContentPosition === 'post') return { bottom: '8px', top: '5px' };
    }
    if (lineVisible) {
      if (chartContentPosition === 'pre') return { bottom: '0px', top: '8px' };
      if (chartContentPosition === 'post') return { bottom: '8px', top: '0px' };
    }
  }
}

function getClusterSizeMillis({ windowSize, width, granularity }) {
  return getBlockSizeMillis({
    windowSize,
    minPixelsPerBlock,
    width,
    rollup: granularity
  });
}

MarkerLanesPresenter.propTypes = {
  timeConfig: propTypeTimeConfig,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  granularity: PropTypes.number,
  hoverState: PropTypes.object,
  chartWidth: PropTypes.number,
  chartBucketWidth: PropTypes.number
};
