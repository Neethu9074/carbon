import React from 'react';

import HorizontalAxis from 'in-new-components/Axis/HorizontalAxis';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { formatTime } from 'in-services/formatters/date';
import { millis } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';

import locals from './CallTimeAxis.mless';

export default getElementDimensions(({ width, span }) => {
  const startTime = getStart(span);
  const endTime = getEnd(span);

  return (
    <div className={locals.timeAxis}>
      <span className={locals.axisLabel}>
        <SvgIcon className={locals.icon} type="time" width={18} height={18} color="#00babb" />
        {`Started: ${formatTime(startTime)}`}
      </span>
      {width && (
        <HorizontalAxis
          align="top"
          width={width}
          drawAxisLine={false}
          formatter={millis}
          tickLength={9}
          scale={{ from: 0, to: endTime - startTime }}
          fixedTickPositions={[0, 0.2, 0.4, 0.6, 0.8, 1]}
        />
      )}
    </div>
  );
});

function getStart(span) {
  let earliestStart = span.start;
  if (span.children) {
    for (let i = 0; i < span.children.length; i++) {
      earliestStart = Math.min(earliestStart, getStart(span.children[i]));
    }
  }
  return earliestStart;
}

function getEnd(span) {
  let latestEnd = span.start + span.duration;
  if (span.children) {
    for (let i = 0; i < span.children.length; i++) {
      latestEnd = Math.max(latestEnd, getEnd(span.children[i]));
    }
  }
  return latestEnd;
}
