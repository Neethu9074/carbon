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
import TooltipContent from 'in-components/PieChart/TooltipContent';
import useResizeObserver from 'in-hooks/useResizeObserver';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './Legend.mless';

export const HEIGHT = 16;

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
          className={classNames('legend-container', {
            [locals.legend]: true,
            [locals.expandedLegend]: isExpanded
          })}
        >
          <MetricSeries
            axis={props.y1}
            axisName="y1"
            labels={props.y1Labels}
            {...props}
            showExpandableTrigger={setIsExpandalbe}
          />
          <MetricSeries
            axis={props.y2}
            axisName="y2"
            labels={props.y2Labels}
            {...props}
            showExpandableTrigger={setIsExpandalbe}
          />
          {isExpandable && (
            <SvgIcon
              type="lib_arrow_expand_down"
              className={classNames('legend-arrow', { [locals.arrowIcon]: true, [locals.iconUp]: isExpanded })}
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
  y1Labels: rpt.array.isRequired,
  y2Labels: rpt.array.isRequired,
  y1: rpt.object.isRequired,
  y2: rpt.object
};

function MetricSeries({ axis, reverseLegendOrder, labels, showExpandableTrigger, slices, timeConfig }) {
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

  const toggleOthers = thisLabel => {
    labels.map(label => {
      if (label !== thisLabel && label.isToggleable) {
        label.onToggle();
      }
    });
  };

  return (
    <ul className={locals.metricList} ref={ref}>
      {(reverseLegendOrder ? rangeRight(labels.length) : range(labels.length)).map(i => {
        const timeShift = labels[i].timeShift || defaultTimeShift;
        const { isDisabled, isToggleable, onToggle, dataSeriesName, name, metricId, renderLabel = true } = labels[i];
        const slice = slices?.[i];

        const content = (
          <li
            key={dataSeriesName}
            className={classNames({
              [locals.metric]: true,
              [locals.disabledMetric]: isDisabled,
              [locals.toggleable]: isToggleable
            })}
            onClick={onToggle}
            onDoubleClick={() => {
              toggleOthers(labels[i]);
            }}
          >
            {icons ? (
              <SvgIcon
                className={classNames({
                  [locals.disabledIcon]: isDisabled
                })}
                size="xs"
                color={icons.colors ? icons.colors[i] : axis.colors100[i]}
                type={icons.types[i]}
              />
            ) : (
              <div
                className={classNames('legend-dot', {
                  [locals.dot]: true,
                  [locals.disabledDot]: isDisabled
                })}
                style={{
                  background: axis.colors100[i]
                }}
              />
            )}

            {name !== 'no_group' ? (
              <span
                className={classNames('legend-label', {
                  [locals.legendLabel]: true
                })}
              >
                {name}
              </span>
            ) : (
              <span className={locals.legendLabelBlank}>{t('in-components:chart.chartLegendBlankLabel')}</span>
            )}

            {slice && <LegendValue slice={slice} timeConfig={timeConfig} />}

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
        return isToggleable
          ? renderLabel && content
          : renderLabel && (
              <Tooltip key={name} content={axis.nonToggleableSeries.get(metricId)}>
                {content}
              </Tooltip>
            );
      })}
    </ul>
  );
}

function LegendValue({ slice, timeConfig }) {
  const { label, formatter } = slice;

  return (
    <div
      key={label}
      className={classNames('legend-value', {
        [locals.legendValue]: true
      })}
    >
      <TooltipContent slice={slice} formatter={formatter} timeConfig={timeConfig} displayLabel />
    </div>
  );
}
