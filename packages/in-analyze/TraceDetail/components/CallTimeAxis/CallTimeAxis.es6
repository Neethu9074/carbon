import React from 'react';

import HorizontalAxis from 'in-new-components/Axis/HorizontalAxis';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { formatTime } from 'in-services/formatters/date';
import { millis } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';

import locals from './CallTimeAxis.mless';

export default getElementDimensions(({ width, call }) => {
  const startTime = getStart(call);
  const endTime = getEnd(call);

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

function getStart(call) {
  let earliestStart = call.start;
  if (call.children) {
    for (let i = 0; i < call.children.length; i++) {
      earliestStart = Math.min(earliestStart, getStart(call.children[i]));
    }
  }
  return earliestStart;
}

function getEnd(call) {
  let latestEnd = call.start + call.duration;
  if (call.children) {
    for (let i = 0; i < call.children.length; i++) {
      latestEnd = Math.max(latestEnd, getEnd(call.children[i]));
    }
  }
  return latestEnd;
}
