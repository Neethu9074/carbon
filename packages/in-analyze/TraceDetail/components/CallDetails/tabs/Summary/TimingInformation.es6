import React from 'react';

import CallStartLabel from 'in-analyze/TraceDetail/components/CallTimeAxis/CallStartLabel';
import { millis } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';
import {
  TOTAL_TIME_COLOR,
  TOTAL_TIME_LABEL,
  NETWORK_TIME_COLOR,
  NETWORK_TIME_LABEL,
  PROCESSING_TIME_COLOR,
  PROCESSING_TIME_LABEL,
  CALL_TIME_COLOR,
  CALL_TIME_LABEL
} from 'in-analyze/TraceDetail/components/CallDetails/tabs/Summary/TimingConstants.es6';

import locals from './TimingInformation.mless';

export default function TimingInformation({ call }) {
  return (
    <div className={locals.timingInformation}>
      <CallStartLabel className={locals.callStartLabel} call={call} />
      <TimeBlock color={TOTAL_TIME_COLOR} label={TOTAL_TIME_LABEL} duration={call.duration} />
      <TimeBlock
        color={NETWORK_TIME_COLOR}
        label={NETWORK_TIME_LABEL}
        duration={call.networkTime}
        totalDuration={call.duration}
      />
      <TimeBlock
        color={PROCESSING_TIME_COLOR}
        label={PROCESSING_TIME_LABEL}
        duration={call.minSelfTime}
        totalDuration={call.duration}
      />
      <TimeBlock
        color={CALL_TIME_COLOR}
        label={CALL_TIME_LABEL}
        duration={call.duration - call.minSelfTime || 0 - call.networkTime || 0}
        totalDuration={call.duration}
      />
    </div>
  );
}

function TimeBlock({ label, duration, totalDuration, color }) {
  duration = duration
    ? `${millis.fixedCompact(duration)} ${totalDuration ? '(' + ((duration / totalDuration * 100) | 0) + '%)' : ''}`
    : '--';

  return (
    <div className={locals.timeBlock}>
      <div className={locals.labelWrapper}>
        <SvgIcon className={locals.timeIcon} type="clock" width={12} height={12} color={color} />
        <span style={{ color }} className={locals.label}>
          {label}
        </span>
      </div>
      <span className={locals.duration}> {duration}</span>
    </div>
  );
}
