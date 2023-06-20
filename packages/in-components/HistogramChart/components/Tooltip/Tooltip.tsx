/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Bucket } from 'in-components/HistogramChart/components/HistogramChartPresenter/types';
import { getRangeLabel } from 'in-components/HistogramChart/components/Tooltip/utils';
import AggregationSymbol from 'in-components/AggregationSymbol';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import { FormatterFn } from 'in-stores/metric/formatters';
import Config from 'in-components/Chart/Configuration';
import { Axis } from 'in-components/Chart/types';
import { TimeShift } from 'in-types';

import locals from './Tooltip.mless';

interface YAxis extends Axis {
  timeShifts: TimeShift[];
}

interface TooltipConfig extends Config {
  data: Bucket[];
  y1: YAxis;
}

interface Props {
  metricBuckets: Bucket[][];
  config: TooltipConfig;
  style: React.CSSProperties;
  formatterY: FormatterFn;
}

export default function Tooltip({ metricBuckets, config, style, formatterY }: Props) {
  const metrics = metricBuckets
    .map((buckets: Bucket[], i: number) => {
      return config.isFiltered('y1', i)
        ? null
        : {
            label: config.y1.labels[i],
            aggregation: 'SUM',
            timeShift: config.y1.timeShifts[i],
            color: config.y1.colors100[i],
            sum: buckets.map(b => b.calls).reduce((a, v) => a + v, 0)
          };
    })
    .filter(Boolean);

  return (
    <div className={locals.tooltipContent} style={style}>
      <div className={locals.header}>{getRangeLabel(metricBuckets[0])}</div>

      <ul className={locals.entries}>
        {metrics.map((metric: any, i: number) => {
          const [metricLabel] = metric.label.split('-');

          return (
            <li key={i} className={locals.entry}>
              <div className={locals.dot} style={{ background: metric.color }} />

              <span className={locals.label}>
                {metricLabel}
                {metric.timeShift.offset !== 0 && (
                  <span className={locals.timeShift}>{` (${getTimeShiftLabel(metric.timeShift)})`}</span>
                )}
              </span>

              {metric.aggregation && (
                <span className={locals.aggregation}>
                  <AggregationSymbol aggregation={metric.aggregation} />
                </span>
              )}

              <span className={locals.value}>{formatterY(metric.sum)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
