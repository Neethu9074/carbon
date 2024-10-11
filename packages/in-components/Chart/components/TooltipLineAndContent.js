/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import TooltipContent from 'in-components/Chart/components/TooltipContent';

import locals from './TooltipLineAndContent.mless';

const TooltipLineAndContent = forwardRef(
  (
    {
      cursorXPosition,
      width,
      chartHeight,
      align,
      timestamp,
      chart,
      reverseTooltipOrder,
      metrics,
      customEventSection,
      highlightedMoment
    },
    ref
  ) => {
    const { excludedLabelsFromTooltip } = metrics.y1;
    return (
      <div
        ref={ref}
        className={classNames(locals.line, 'tooltip')}
        style={{
          left: cursorXPosition
        }}
      >
        <div className={[locals[align]]}>
          <TooltipContent
            customEventSection={customEventSection}
            timestamp={timestamp}
            chart={chart}
            reverseTooltipOrder={reverseTooltipOrder}
            excludedLabelsFromTooltip={excludedLabelsFromTooltip}
            width={width}
            chartHeight={chartHeight}
            highlightedMoment={highlightedMoment}
          />
        </div>
      </div>
    );
  }
);

TooltipLineAndContent.displayName = 'TooltipLineAndContent';

export default TooltipLineAndContent;
