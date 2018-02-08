import React from 'react';

import { hexToRGB } from 'in-services/formatters/color';

import locals from './Legend.mless';

export default function Legend({ chart }) {
  return (
    <div className={locals.legend}>
      <MetricSeries axis={chart.config.y1} />
      <MetricSeries axis={chart.config.y2} />
    </div>
  );
}

function MetricSeries({ axis }) {
  if (!axis) {
    return null;
  }
  return (
    <ul className={locals.metricList}>
      {axis.labels.map((label, i) => (
        <li
          key={label}
          className={locals.metric}
          style={{
            background: toBackground(axis.colors[i]),
            color: axis.colors[i]
          }}
        >
          {label}
        </li>
      ))}
    </ul>
  );
}

function toBackground(hexColor) {
  const color = hexToRGB(hexColor);
  return `rgba(${color.r}, ${color.g}, ${color.b}, 0.1)`;
}
