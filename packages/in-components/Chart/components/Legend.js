import { range, rangeRight } from 'lodash';
import classNames from 'classnames';
import rpt from 'prop-types';
import React from 'react';

import { defaultTimeShift, getTimeShiftLabel } from 'in-stores/time/shifting';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './Legend.mless';

export const HEIGHT = 32;

export default function Legend(props) {
  return (
    <div className={locals.legend}>
      <MetricSeries axis={props.y1} axisName="y1" labels={props.y1Lables} {...props} />
      <MetricSeries axis={props.y2} axisName="y2" labels={props.y2Lables} {...props} />
    </div>
  );
}

Legend.propTypes = {
  y1Lables: rpt.array.isRequired,
  y2Lables: rpt.array.isRequired,
  y1: rpt.object.isRequired,
  y2: rpt.object
};

function MetricSeries({ axis, reverseLegendOrder, labels }) {
  if (!axis || !labels) {
    return null;
  }
  const icons = axis.icons;

  return (
    <ul className={locals.metricList}>
      {(reverseLegendOrder ? rangeRight(labels.length) : range(labels.length)).map(i => {
        const timeShift = labels[i].timeShift || defaultTimeShift;
        const { isDisabled, isToggleable, onToggle, dataSeriesName, name, metricId } = labels[i];

        const content = (
          <li
            key={dataSeriesName}
            className={classNames({
              [locals.metric]: true,
              [locals.disabledMetric]: isDisabled,
              [locals.toggleable]: isToggleable
            })}
            onClick={onToggle}
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

            {name}

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
          <Tooltip key={name} content={axis.nonToggleableSeries.get(metricId)}>
            {content}
          </Tooltip>
        );
      })}
    </ul>
  );
}
