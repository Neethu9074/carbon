import React from 'react';

import { hasOnlyExitSpan } from 'in-analyze/TraceDetail/shared/CallHelper.es6';
import {
  NETWORK_TIME_COLOR,
  NETWORK_TIME_LABEL,
  SELF_TIME_COLOR,
  SELF_TIME_LABEL,
  WAITING_TIME_COLOR,
  WAITING_TIME_LABEL,
  NETWORK_TIME_COLOR_OPACITY
} from 'in-analyze/TraceDetail/components/TimingConstants';
import { millis } from 'in-services/formatters/number';

import locals from './TimingInformation.mless';

export default function TimingInformation({ call }) {
  const netWorkTimeColor = NETWORK_TIME_COLOR;
  const selfTimeColor = SELF_TIME_COLOR;

  const waitingTime = hasOnlyExitSpan(call) ? null : call.duration - (call.minSelfTime || 0) - (call.networkTime || 0);

  return (
    <div className={locals.timingInformation}>
      <TimeBlock
        color={selfTimeColor}
        label={SELF_TIME_LABEL}
        duration={call.minSelfTime}
        totalDuration={call.duration}
      />
      <TimeBlock
        color={netWorkTimeColor}
        opacity={NETWORK_TIME_COLOR_OPACITY}
        label={NETWORK_TIME_LABEL}
        duration={call.networkTime}
        totalDuration={call.duration}
      />
      <TimeBlock
        color={WAITING_TIME_COLOR}
        label={WAITING_TIME_LABEL}
        duration={waitingTime}
        totalDuration={call.duration}
      />
    </div>
  );
}

function TimeBlock({ label, duration, totalDuration, color, opacity = 1 }) {
  const durationInPercent =
    totalDuration && duration == null ? null : '(' + ((duration / totalDuration * 100) | 0) + '%)';

  duration = duration == null ? '--' : `${millis.fixedCompact(duration)}`;

  return (
    <div className={locals.timeBlock}>
      <div className={locals.timeColorIndicator} style={{ background: color, opacity }} />
      <span className={locals.label}>{label}</span>
      <span className={locals.duration}>{duration}</span>
      <span className={locals.durationInPercent}>{durationInPercent}</span>
    </div>
  );
}
