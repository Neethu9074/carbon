import React from 'react';

import CallStartLabel from 'in-analyze/TraceDetail/components/CallTimeAxis/CallStartLabel';
import { getStart, getEnd } from 'in-analyze/TraceDetail/components/callStartAndEndTime';
import HorizontalAxis from 'in-new-components/Axis/HorizontalAxis';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { millis } from 'in-services/formatters/number';
import theme from 'in-themes';

import locals from './CallTimeAxis.mless';

export default getElementDimensions(function CallTimeAxis({ width, call, showStartLabel }) {
  const startTime = getStart(call);
  const endTime = getEnd(call);

  if (!width) {
    return <div />;
  }

  return (
    <div className={locals.timeAxis}>
      {showStartLabel && <CallStartLabel startTime={startTime} />}
      {width && (
        <HorizontalAxis
          align="top"
          width={width}
          formatter={millis}
          detailedFormatting
          tickLength={8}
          tickColor={theme.lib.colors.N400}
          tickLabelColor={theme.lib.colors.N800Dark}
          scale={{ from: 0, to: endTime - startTime }}
          fixedTickPositions={[0, 0.2, 0.4, 0.6, 0.8, 1]}
        />
      )}
    </div>
  );
});
