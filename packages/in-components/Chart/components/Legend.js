import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { WIDTH } from 'in-new-components/Axis/VerticalAxis';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './Legend.mless';

export default connectTo(
  props => ({
    filteredDataSeries: props.chart.config.filteredDataSeries$
  }),
  function Legend({ chart, filteredDataSeries, alignLegendToLeftSideOfChart = false }) {
    return (
      <div style={alignLegendToLeftSideOfChart ? { paddingLeft: WIDTH } : null} className={locals.legend}>
        <MetricSeries
          chart={chart}
          axis={chart.config.y1}
          filteredDataSeries={filteredDataSeries}
          config={chart.config}
        />
        <MetricSeries
          chart={chart}
          axis={chart.config.y2}
          filteredDataSeries={filteredDataSeries}
          config={chart.config}
        />
      </div>
    );
  }
);

function MetricSeries({ chart, axis, config, filteredDataSeries }) {
  if (!axis) {
    return null;
  }

  const icons = axis.icons;

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
            onClick={() => {
              config.toggleDataSeries(label);
              chart.requestRender();
            }}
          >
            {icons ? (
              <SvgIcon
                className={evaluateClassNames({
                  [locals.disabledIcon]: isDisabled
                })}
                size="xs"
                style={{ fill: icons.colors ? icons.colors[i] : axis.colors100[i] }}
                type={icons.types[i]}
              />
            ) : (
              <div
                className={evaluateClassNames({
                  [locals.dot]: true,
                  [locals.disabledDot]: isDisabled
                })}
                style={{
                  background: axis.colors100[i]
                }}
              />
            )}

            {label}
          </li>
        );
      })}
    </ul>
  );
}
