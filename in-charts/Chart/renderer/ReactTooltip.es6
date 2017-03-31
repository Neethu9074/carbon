import React from 'react';

import { formatDateTime } from 'in-services/formatters/date';

import './ReactTooltip.less';

const block = 'in-chart-v2-tooltip';

function MetricBlock({ dataColumn, config, axisName }) {
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
    <div>
      {dataColumn.map((dataRow, i) => (
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
      ))}
    </div>
  );
}

export default function ReactTooltip({ time, config, y1DataColumn, y2DataColumn, dataPointsAvailable }) {
  if (!dataPointsAvailable) {
    return null;
  }

  return (
    <div className={block}>

      <p className={`${block}__time`}>
        {formatDateTime(time)}
      </p>

      <dl className={`${block}__metrics`}>
        <MetricBlock dataColumn={y1DataColumn} config={config} axisName="y1" />

        {config.y2 ? <MetricBlock dataColumn={y2DataColumn} config={config} axisName="y2" /> : null}
      </dl>
    </div>
  );
}

function identity(a) {
  return a;
}
