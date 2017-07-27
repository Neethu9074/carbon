import React from 'react';

import { formatTime, formatDateTime } from 'in-services/formatters/date';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { evaluateClassNames } from 'in-services/util/classnames';

import './ReactTooltip.less';

const block = 'in-chart-tooltip';

export default function ReactTooltip({ time, config, y1DataColumn, y2DataColumn, dataPointsAvailable }) {
  if (!dataPointsAvailable) {
    return null;
  }

  let bothAggregationsAreEqual =
    config.y1 && config.y2 && config.y1.dynamicCalculatedBlockSizeMillis === config.y2.dynamicCalculatedBlockSizeMillis;
  const timeToUseForDynamicAggregationTooltip = bothAggregationsAreEqual ? null : time;

  return (
    <div className={block}>
      <dl className={`${block}__metrics`}>
        <MetricBlock time={time} dataColumn={y1DataColumn} config={config} axisName="y1" />
        {config.y2
          ? <MetricBlock
              time={timeToUseForDynamicAggregationTooltip}
              dataColumn={y2DataColumn}
              config={config}
              axisName="y2"
            />
          : null}
      </dl>
    </div>
  );
}

function MetricBlock({ time, dataColumn, config, axisName }) {
  const classes = evaluateClassNames({
    [`${block}__metric-block`]: time
  });

  if (!dataColumn) {
    return (
      <div>
        No data points for {axisName.toUpperCase()} axis.
      </div>
    );
  }

  const axisConfig = config[axisName];
  const formatter = axisConfig.tooltipFormatter || axisConfig.formatter || identity;

  return (
    <div className={classes}>
      <DynamicAggregationMarker time={time} axis={axisConfig} />
      {dataColumn.map((dataRow, i) =>
        <div className={`${block}__metric`} key={i}>
          <dt
            style={{
              color: axisConfig.colors[i]
            }}
            className={`${block}__metric-name`}
          >
            {axisConfig.labels[i]}
          </dt>
          <dd className={`${block}__metric-value`}>
            {dataRow != null && dataRow[1] != null ? formatter(dataRow[1]) : ''}
          </dd>
        </div>
      )}
    </div>
  );
}

function identity(a) {
  return a;
}

function DynamicAggregationMarker({ time, axis }) {
  if (!time) {
    return null;
  }
  if (!axis.isDynamicAggregated) {
    return (
      <div>
        {formatDateTime(time)}
      </div>
    );
  }

  const from = time - axis.dynamicCalculatedBlockSizeMillis / 2;
  const to = time + axis.dynamicCalculatedBlockSizeMillis / 2;
  const oneDay = 1000 * 60 * 60 * 24;
  const formatter = to - from >= oneDay ? formatDateTime : formatTime;

  return (
    <div className={`${block}__time`}>
      {` ${formatter(from)} `}
      <span className={`${block}__time-marker`}>
        with a size of:
      </span>
      {` ${formatDurationAccurately(axis.dynamicCalculatedBlockSizeMillis, 0)}`}
    </div>
  );
}
