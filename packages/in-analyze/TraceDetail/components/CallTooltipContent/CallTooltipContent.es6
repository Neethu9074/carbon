import React from 'react';

import locals from './CallTooltipContent.mless';

export default function CallTooltipContent({ call }) {
  let values = [];

  if (call.duration) {
    values.push({
      label: 'Total Time',
      value: call.duration
    });
  }

  if (call.networkTime) {
    values.push({
      label: 'Network',
      value: call.networkTime
    });
  }

  if (call.minSelfTime) {
    values.push({
      label: 'Self',
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
        <li className={locals.timingValue}>
          <span>{value.label}</span>
          <span>{value.value}ms</span>
        </li>
      ))}
    </ul>
  );
}
