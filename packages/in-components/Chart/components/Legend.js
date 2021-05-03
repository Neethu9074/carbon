/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import { range, rangeRight } from 'lodash';
import classNames from 'classnames';
import rpt from 'prop-types';

import { SvgIcon } from '@instana/components';

import { defaultTimeShift, getTimeShiftLabel } from 'in-stores/time/shifting';
import useResizeObserver from 'in-hooks/useResizeObserver';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './Legend.mless';

export const HEIGHT = 32;

export default function Legend(props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandable, setIsExpandalbe] = useState(false);

  const toggleLegendOverlay = () => {
    setIsExpanded(expanded => !expanded);
  };
  return (
    <>
      <div className={classNames({ [locals.legendContainer]: isExpanded })}>
        <div
          className={classNames({
            [locals.legend]: true,
            [locals.expandedLegend]: isExpanded
          })}
        >
          <MetricSeries
            axis={props.y1}
            axisName="y1"
            labels={props.y1Lables}
            {...props}
            showExpandableTrigger={setIsExpandalbe}
          />
          <MetricSeries
            axis={props.y2}
            axisName="y2"
            labels={props.y2Lables}
            {...props}
            showExpandableTrigger={setIsExpandalbe}
          />
          {isExpandable && (
            <SvgIcon
              type="lib_arrow_expand_down"
              className={classNames({ [locals.arrowIcon]: true, [locals.iconUp]: isExpanded })}
              onClick={toggleLegendOverlay}
            />
          )}
        </div>
      </div>
      <div className={isExpanded ? locals.overlay : ''} onClick={toggleLegendOverlay} />
    </>
  );
}

Legend.propTypes = {
  y1Lables: rpt.array.isRequired,
  y2Lables: rpt.array.isRequired,
  y1: rpt.object.isRequired,
  y2: rpt.object
};

function MetricSeries({ axis, reverseLegendOrder, labels, showExpandableTrigger }) {
  const { ref, height } = useResizeObserver();

  useEffect(() => {
    if (height < ref.current?.scrollHeight) {
      showExpandableTrigger(true);
    }
  }, [height, ref, showExpandableTrigger]);

  if (!axis || !labels) {
    return null;
  }

  const icons = axis.icons;

  return (
    <ul className={locals.metricList} ref={ref}>
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

            <span className={locals.legendLabel}>{name}</span>

            {timeShift && timeShift.offset !== 0 && (
              <Tooltip
                content={t('in-components:chart.chartLendMetricTimeShifted', {
                  timeShiftedLabel: getTimeShiftLabel(timeShift)
                })}
              >
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
