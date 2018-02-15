import React from 'react';

import { formatDateShort, formatTime } from 'in-services/formatters/date';

import locals from './TooltipContent.mless';

export default function TooltipContent({ timestamp, chart }) {
  const dataPointsAtTime = chart.collectAllDataPointsAtTime(timestamp);

  return (
    <div className={locals.tooltipContent}>
      <span className={locals.time}>{`${formatTime(timestamp)} - ${formatDateShort(timestamp)}`}</span>
      <div className={locals.metricListing}>
        <MetricSeries config={chart.config} axisName="y1" dataPointsAtTime={dataPointsAtTime} />
        <MetricSeries config={chart.config} axisName="y2" dataPointsAtTime={dataPointsAtTime} />
      </div>
    </div>
  );
}

function MetricSeries({ config, axisName, dataPointsAtTime }) {
  const axis = config[axisName];
  if (!axis) {
    return null;
  }

  return (
    <ul className={locals.tooltipMetricList}>
      {axis.labels.map((label, i) => {
        const dataPointsForAxis = dataPointsAtTime[axisName];
        const dataPoint = dataPointsForAxis ? dataPointsForAxis[label] : null;
        return (
          <li key={label} className={locals.metricValue}>
            <span
              style={{
                color: axis.colors[i]
              }}
            >
              {label}
            </span>{' '}
            <span>{dataPoint ? axis.formatter[i].detailed(dataPoint[1]) : '--'}</span>
          </li>
        );
      })}
    </ul>
  );
}
