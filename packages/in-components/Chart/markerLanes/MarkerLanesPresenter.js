import React, { useState, Children, cloneElement, useRef } from 'react';
import PropTypes from 'prop-types';

import { getBlockSizeMillis } from 'in-services/util/dynamicAggregation';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { sizes } from 'in-components/SvgIcon/SvgIcon';

import locals from './MarkerLanesPresenter.mless';

export default function MarkerLanesPresenter({ children, granularity, hoverState, isClustered, ...remainingProps }) {
  const [labelAlignment, setLabelAligment] = useState('left');
  const [labelVisible, setLabelVisible] = useState(false);
  const markerLanesWrapperRef = useRef(null);

  if (!children || !granularity || !hoverState || !remainingProps.timeConfig) return null;

  const minPixelsPerBlock = sizes.xs + 16;
  const clusterSizeMillis = isClustered
    ? getBlockSizeMillis({
        windowSize: remainingProps.timeConfig.windowSize,
        minPixelsPerBlock,
        width: markerLanesWrapperRef.current?.getBoundingClientRect()?.width,
        rollup: granularity
      })
    : granularity;

  return (
    <div className={locals.markerLanesContainer} onMouseLeave={() => setLabelVisible(false)}>
      <div ref={markerLanesWrapperRef} className={locals.markerLanesWrapper} onMouseEnter={() => setLabelVisible(true)}>
        {Children.map(children, child => {
          return cloneElement(child, {
            ...remainingProps,
            labelVisible,
            labelAlignment,
            clusterSizeMillis,
            isClustered
          });
        })}
      </div>
      <div
        className={locals[labelAlignment]}
        onMouseEnter={() => setLabelAligment(labelAlignment === 'left' ? 'right' : 'left')}
      />
      <HoverLine {...hoverState} />
    </div>
  );
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

MarkerLanesPresenter.propTypes = {
  timeConfig: propTypeTimeConfig,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  granularity: PropTypes.number,
  hoverState: PropTypes.object,
  isClustered: PropTypes.bool
};
