/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import CallStartLabel from 'in-applications/analyze/components/TraceDetails/components/CallTimeAxis/CallStartLabel';
import { getStart, getEnd } from 'in-applications/analyze/components/TraceDetails/components/callStartAndEndTime';
import HorizontalAxis from 'in-new-components/Axis/HorizontalAxis';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import { millis } from 'in-services/formatters/number';
import theme from 'in-themes';

import locals from './CallTimeAxis.mless';

export default function CallTimeAxis({ call, showStartLabel }) {
  const { width, ref } = useResizeObserverCustom();

  const startTime = getStart(call);
  const endTime = getEnd(call);
  const duration = endTime - startTime;

  return (
    <div className={locals.timeAxis} ref={ref}>
      {width && showStartLabel && <CallStartLabel startTime={startTime} />}
      {width && (
        <HorizontalAxis
          align="top"
          width={width}
          formatter={millis.forcedCompactOnMs}
          detailedFormatting
          roundTickPositions
          tickLength={8}
          tickColor={theme.lib.colors.N400}
          tickLabelColor={theme.lib.colors.N800Dark}
          scale={{ from: 0, to: duration }}
          fixedTickPositions={calculateTickPositions(duration)}
        />
      )}
    </div>
  );
}

function calculateTickPositions(duration) {
  if (duration < 1) {
    return [0];
  } else if (duration < 2) {
    return [0, 1];
  } else if (duration < 4) {
    return [0, 0.33, 0.66, 1];
  } else if (duration < 5) {
    return [0, 0.25, 0.5, 0.75, 1];
  } else {
    return [0, 0.2, 0.4, 0.6, 0.8, 1];
  }
}
