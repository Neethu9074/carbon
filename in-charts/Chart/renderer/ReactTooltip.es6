import React from 'react';

import { formatTime, formatDateTime } from 'in-services/formatters/date';
import { formatDurationAccurately } from 'in-services/formatters/date';

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
  const axisConfig = config[axisName];
  const formatter = axisConfig.tooltipFormatter || axisConfig.formatter || identity;
  const colors = axisConfig.tooltipColors || axisConfig.colors;

  return (
    <div className={`${block}__metric-block`}>
      <TimeMarker time={time} axis={axisConfig} config={config} />
      {axisConfig.labels.map((axis, i) => {
        const dataPoint = dataColumn && dataColumn[i];
        return (
          <div className={`${block}__metric`} key={i}>
            <dt
              style={{
                color: colors[i]
              }}
              className={`${block}__metric-name`}
            >
              {axisConfig.labels[i]}
            </dt>
            <dd className={`${block}__metric-value`}>
              {dataPoint ? formatter(dataPoint[1]) : '--'}
            </dd>
          </div>
        );
      })}

    </div>
  );
}

function identity(a) {
  return a;
}

function TimeMarker({ time, axis, config }) {
  if (!axis.isDynamicAggregated) {
    return (
      <div className={`${block}__aggregated`}>
        <div className={`${block}__aggregated-time`}>
          {formatDateTime(time)}
        </div>
        <div className={`${block}__aggregation`}>
          {config.rollup.label} rollup
        </div>
      </div>
    );
  }

  const from = time - axis.dynamicCalculatedBlockSizeMillis;
  const to = time;
  const oneDay = 1000 * 60 * 60 * 24;
  const formatter = to - from >= oneDay ? formatDateTime : formatTime;

  return (
    <div className={`${block}__aggregated`}>
      <div className={`${block}__aggregated-time`}>
        {time ? `${formatter(from)} - ${formatter(to)}` : null}
      </div>
      <div className={`${block}__aggregation`}>
        {`${formatDurationAccurately(axis.dynamicCalculatedBlockSizeMillis, 0)} ${axis.aggregation}`}
      </div>
    </div>
  );
}
