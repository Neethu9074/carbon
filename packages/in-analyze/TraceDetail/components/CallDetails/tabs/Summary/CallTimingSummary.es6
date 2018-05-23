import React from 'react';

import { TOTAL_TIME_COLOR, TOTAL_TIME_LABEL } from 'in-analyze/TraceDetail/components/TimingConstants.es6';
import CallStartLabel from 'in-analyze/TraceDetail/components/CallTimeAxis/CallStartLabel';
import Pill from 'in-new-components/Pill';

import locals from './CallTimingSummary.mless';

export default function CallTimingSummary({ call }) {
  return (
    <div className={locals.callTimingSummary}>
      <CallStartLabel className={locals.callStartLabel} call={call} />
      <div className={locals.totalTimeWrapper}>
        <span style={{ color: TOTAL_TIME_COLOR }}>{TOTAL_TIME_LABEL}</span>
        <Pill className={locals.pill} color={TOTAL_TIME_COLOR}>
          {call.duration}ms
        </Pill>
      </div>
    </div>
  );
}
