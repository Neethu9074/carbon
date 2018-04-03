import React, { Fragment } from 'react';

import { formatDateTime } from 'in-services/formatters/date';

import locals from './TooltipContent.mless';

export default function TooltipContent({ timestamp, chart }) {
  const dataPointsAtTime = chart.collectAllDataPointsAtTime(timestamp);

  return (
    <div className={locals.tooltipContent}>
      <div className={locals.heading}>
        {formatDateTime(timestamp)} <span className={locals.rollupLabel}>{chart.config.rollupLabel}</span>
      </div>
      <MetricSeries config={chart.config} axisName="y1" dataPointsAtTime={dataPointsAtTime} />
      <MetricSeries config={chart.config} axisName="y2" dataPointsAtTime={dataPointsAtTime} addSpacer />
    </div>
  );
}

function MetricSeries({ config, axisName, dataPointsAtTime, addSpacer }) {
  const axis = config[axisName];
  if (!axis) {
    return null;
  }

  return (
    <Fragment>
      {addSpacer && <div className={locals.spacer} />}

      <ul className={locals.tooltipMetricList}>
        {axis.labels.map((label, i) => {
          if (!config.filteredDataSeries.has(label)) {
            const dataPointsForAxis = dataPointsAtTime[axisName];
            const dataPoint = dataPointsForAxis ? dataPointsForAxis[label] : null;
            const aggregations = axis.aggregations || [];
            const aggregation = aggregations[i];

            return (
              <li key={label} className={locals.metricValue}>
                <div>
                  <span
                    style={{
                      color: axis.colors100[i]
                    }}
                  >
                    {label}
                  </span>{' '}
                  <span className={locals.aggregation}>{aggregation && `(${aggregation})`}</span>{' '}
                </div>
                <span>
                  {dataPoint
                    ? axis.tooltipFormatter
                      ? axis.tooltipFormatter(dataPoint[1])
                      : axis.formatter[i].detailed(dataPoint[1])
                    : '--'}
                </span>
              </li>
            );
          }
        })}
      </ul>
    </Fragment>
  );
}
