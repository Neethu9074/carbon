import React from 'react';

import CallStartLabel from 'in-analyze/TraceDetail/components/CallTimeAxis/CallStartLabel';
import { millis } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TimingInformation.mless';

export default function TimingInformation({ call }) {
  return (
    <div className={locals.timingInformation}>
      <CallStartLabel className={locals.callStartLabel} call={call} />
      <TimeBlock color="#47626A" label="Total Time" duration={call.duration} />
      <TimeBlock color="#00BBFF" label="Network" duration={call.networkTime} totalDuration={call.duration} />
      <TimeBlock color="#1A4FFF" label="Self" duration={call.duration / 2} totalDuration={call.duration} />
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
        <SvgIcon className={locals.timeIcon} type="timer" width={12} height={12} color={color} />
        <span style={{ color }} className={locals.label}>
          {label}
        </span>
      </div>
      <span className={locals.duration}> {duration}</span>
    </div>
  );
}
