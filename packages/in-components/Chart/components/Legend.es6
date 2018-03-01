import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import connectTo from 'in-hoc/connectTo';

import locals from './Legend.mless';

export default connectTo(
  props => ({
    filteredDataSeries: props.chart.config.signals.on('filteredDataSeriesChanged')
  }),
  function Legend({ chart, filteredDataSeries, alignment }) {
    return (
      <div className={`${locals.legend} ${alignment === 'top' ? locals.top : locals.bottom}`}>
        <MetricSeries axis={chart.config.y1} filteredDataSeries={filteredDataSeries} config={chart.config} />
        <MetricSeries axis={chart.config.y2} filteredDataSeries={filteredDataSeries} config={chart.config} />
      </div>
    );
  }
);

function MetricSeries({ axis, config, filteredDataSeries }) {
  if (!axis) {
    return null;
  }
  return (
    <ul className={locals.metricList}>
      {axis.labels.map((label, i) => {
        const isDisabled = filteredDataSeries && filteredDataSeries.has(label);
        return (
          <li
            key={label}
            className={evaluateClassNames({
              [locals.metric]: true,
              [locals.disabledMetric]: isDisabled
            })}
            onClick={() => config.toggleDataSeries(label)}
          >
            <div
              className={evaluateClassNames({
                [locals.dot]: true,
                [locals.disabledDot]: isDisabled
              })}
              style={{
                background: axis.colors[i]
              }}
            />
            {label}
          </li>
        );
      })}
    </ul>
  );
}
