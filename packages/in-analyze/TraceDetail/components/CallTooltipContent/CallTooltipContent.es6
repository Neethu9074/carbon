import React from 'react';

import {
  TOTAL_TIME_LABEL,
  NETWORK_TIME_LABEL,
  PROCESSING_TIME_LABEL
} from 'in-analyze/TraceDetail/components/TimingConstants.es6';

import locals from './CallTooltipContent.mless';

export default function CallTooltipContent({ call }) {
  let values = [];

  if (call.duration) {
    values.push({
      label: TOTAL_TIME_LABEL,
      value: call.duration
    });
  }

  if (call.networkTime) {
    values.push({
      label: NETWORK_TIME_LABEL,
      value: call.networkTime
    });
  }

  if (call.minSelfTime) {
    values.push({
      label: PROCESSING_TIME_LABEL,
      value: call.minSelfTime
    });
  }

  return (
    <div className={locals.content}>
      <div className={locals.heading}>{call.label}</div>
      <TimingValueList values={values} />
    </div>
  );
}

function TimingValueList({ values }) {
  return (
    <ul className={locals.timingValueList}>
      {values.map(value => (
        <li key={value.label} className={locals.timingValue}>
          <span>{value.label}</span>
          <span>{value.value}ms</span>
        </li>
      ))}
    </ul>
  );
}
