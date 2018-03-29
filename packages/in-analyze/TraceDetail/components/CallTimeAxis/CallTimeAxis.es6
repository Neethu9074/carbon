import React from 'react';

import getElementDimensions from 'in-hoc/getElementDimensions';
import HorizontalAxis from 'in-new-components/Axis/HorizontalAxis';
import { millis } from 'in-services/formatters/number';

import locals from './CallTimeAxis.mless';

export default getElementDimensions(({ width, startTime, endTime }) => {
  const startTimeLabel = 'Started: ' + new Date(startTime).toTimeString().substr(0, 8);
  return (
    <div className={locals.axis}>
      <span className={locals.axisLabel}>{startTimeLabel}</span>
      {width && (
        <HorizontalAxis
          formatter={millis}
          align="top"
          width={width}
          scale={{ from: 0, to: endTime - startTime }}
          fixedTickPositions={[0, 0.2, 0.4, 0.6, 0.8, 1]}
        />
      )}
    </div>
  );
});
