/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { millis, number, latency } from 'in-services/formatters/number';
import AggregationSymbol from 'in-components/AggregationSymbol';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import { t } from 'in-i18n';

import locals from './Tooltip.mless';

export default function Tooltip({ metricBuckets, percentileBuckets, config, style }) {
  const metrics = metricBuckets
    .map((buckets, i) => {
      return config.isFiltered('y1', i)
        ? null
        : {
            label: config.y1.labels[i],
            aggregation: 'SUM',
            timeShift: config.y1.timeShifts[i],
            color: config.y1.colors100[i],
            sum: buckets.map(b => b.calls).reduce(sumReducer, 0)
          };
    })
    .filter(Boolean);

  return (
    <div className={locals.tooltipContent} style={style}>
      <div className={locals.header}>{latencyRangeLabel(metricBuckets[0])}</div>

      <ul className={locals.entries}>
        {metrics.map((metric, i) => (
          <li key={i} className={locals.entry}>
            <div className={locals.dot} style={{ background: metric.color }} />
            <span className={locals.label}>
              {metric.label}
              {metric.timeShift.offset !== 0 && (
                <span className={locals.timeShift}>{` (${getTimeShiftLabel(metric.timeShift)})`}</span>
              )}
            </span>
            {metric.aggregation && (
              <span className={locals.aggregation}>
                <AggregationSymbol aggregation={metric.aggregation} />
              </span>
            )}
            <span className={locals.value}>{number.forcedCompact.detailed(metric.sum)}</span>
          </li>
        ))}

        {// show the percentiles only if the main metric is enabled
        !config.isFiltered('y1', 0) &&
          percentileBuckets.reduce(arrayConcatReducer, []).map(p => (
            <li key={p.percentile} className={locals.entry}>
              <span className={locals.label}>p{p.percentile}</span>
              <span className={locals.value}>{latency.detailed(p.latency)}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

Tooltip.propTypes = {
  metricBuckets: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        calls: PropTypes.number.isRequired
      })
    )
  ).isRequired,
  percentileBuckets: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        percentile: PropTypes.number.isRequired,
        latency: PropTypes.number.isRequired
      })
    )
  ).isRequired,
  config: PropTypes.shape({
    y1: PropTypes.shape({
      labels: PropTypes.arrayOf(PropTypes.string).isRequired,
      colors100: PropTypes.arrayOf(PropTypes.string).isRequired,
      timeShifts: PropTypes.arrayOf(PropTypes.object).isRequired
    }),
    isFiltered: PropTypes.func.isRequired
  }).isRequired,
  style: PropTypes.object
};

function latencyRangeLabel(buckets) {
  const formatTime = millis.forcedCompactOnMs.detailed;
  const from = buckets[0].from && formatTime(buckets[0].from);
  const to = buckets[buckets.length - 1].to && formatTime(buckets[buckets.length - 1].to);
  let latencyRangeLabel;
  if (to == null) {
    latencyRangeLabel = `> ${from}`;
  } else if (from == null || from === 0) {
    latencyRangeLabel = `< ${to}`;
  } else {
    latencyRangeLabel = t('in-components:latencyDistributionBase10Chart.latencyRangeLabelFromTimeToTime', {
      from: from,
      to: to
    });
  }
  return latencyRangeLabel;
}

function sumReducer(a, v) {
  return a + v;
}

function arrayConcatReducer(a, v) {
  return a.concat(v);
}
