import { range, rangeRight } from 'lodash';
import React from 'react';

import { getTimeShiftLabel, defaultTimeShift } from 'in-stores/time/shifting';
import classNames from 'classnames';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

import locals from './Legend.mless';

export const HEIGHT = 32;

export default connectTo(
  props => ({
    filteredDataSeries: props.chart.config.filteredDataSeries$
  }),
  function Legend({ chart, filteredDataSeries }) {
    return (
      <div className={locals.legend}>
        <MetricSeries
          chart={chart}
          axis={chart.config.y1}
          axisName="y1"
          filteredDataSeries={filteredDataSeries}
          config={chart.config}
        />
        <MetricSeries
          chart={chart}
          axis={chart.config.y2}
          axisName="y2"
          filteredDataSeries={filteredDataSeries}
          config={chart.config}
        />
      </div>
    );
  }
);

function MetricSeries({ chart, axis, config, filteredDataSeries, axisName }) {
  if (!axis) {
    return null;
  }

  const icons = axis.icons;

  return (
    <ul className={locals.metricList}>
      {(config.reverseLegendOrder ? rangeRight(axis.labels.length) : range(axis.labels.length)).map(i => {
        const label = axis.labels[i];
        const dataSeriesName = `${axisName}-${i}`;
        const isDisabled = filteredDataSeries && filteredDataSeries.has(dataSeriesName);
        const isToggleable =
          !axis.nonToggleableSeries ||
          !(axis.nonToggleableSeries.has(label) || axis.nonToggleableSeries.has(axis.metricIds[i]));
        const timeShift = (axis.timeShifts && axis.timeShifts[i]) || defaultTimeShift;

        const content = (
          <li
            key={i}
            className={classNames({
              [locals.metric]: true,
              [locals.disabledMetric]: isDisabled,
              [locals.toggleable]: isToggleable
            })}
            onClick={() => {
              if (isToggleable) {
                config.toggleDataSeries(dataSeriesName);
                chart.renderScheduler.forceRender();
              }
            }}
          >
            {icons ? (
              <SvgIcon
                className={classNames({
                  [locals.disabledIcon]: isDisabled
                })}
                size="xs"
                style={{ fill: icons.colors ? icons.colors[i] : axis.colors100[i] }}
                type={icons.types[i]}
              />
            ) : (
              <div
                className={classNames({
                  [locals.dot]: true,
                  [locals.disabledDot]: isDisabled
                })}
                style={{
                  background: axis.colors100[i]
                }}
              />
            )}

            {label}

            {timeShift && timeShift.offset !== 0 && (
              <Tooltip content={`Metric is time shifted to: ${getTimeShiftLabel(timeShift)}`}>
                <SvgIcon className={locals.timeShift} size="xxs" type="lib_datetime_time" />
              </Tooltip>
            )}
          </li>
        );
        return isToggleable ? (
          content
        ) : (
          <Tooltip key={label} content={axis.nonToggleableSeries.get(axis.metricIds[i])}>
            {content}
          </Tooltip>
        );
      })}
    </ul>
  );
}
