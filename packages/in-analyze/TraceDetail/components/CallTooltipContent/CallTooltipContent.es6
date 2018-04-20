import React from 'react';

import {
  TOTAL_TIME_LABEL,
  NETWORK_TIME_LABEL,
  SELF_TIME_LABEL
} from 'in-analyze/TraceDetail/components/TimingConstants.es6';
import { millis } from 'in-services/formatters/number';

import locals from './CallTooltipContent.mless';

export default function CallTooltipContent({ call }) {
  let values = [];

  values.push({
    label: TOTAL_TIME_LABEL,
    value: formatDuration(call.duration)
  });

  values.push({
    label: NETWORK_TIME_LABEL,
    value: formatDuration(call.networkTime, call.duration)
  });

  values.push({
    label: SELF_TIME_LABEL,
    value: formatDuration(call.minSelfTime, call.duration)
  });

  return (
    <div className={locals.content}>
      <div className={locals.heading}>{call.label}</div>
      <TimingValueList values={values} />
    </div>
  );
}

function formatDuration(duration, totalDuration) {
  return duration == null
    ? '--'
    : `${millis.fixedCompact(duration)} ${totalDuration ? '(' + ((duration / totalDuration * 100) | 0) + '%)' : ''}`;
}

function TimingValueList({ values }) {
  return (
    <ul className={locals.timingValueList}>
      {values.map(value => (
        <li key={value.label} className={locals.timingValue}>
          <span>{value.label}</span>
          <span>{value.value}</span>
        </li>
      ))}
    </ul>
  );
}
